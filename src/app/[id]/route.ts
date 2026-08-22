import { NextRequest, NextResponse } from "next/server";

import {
  malformedErrorBody,
  propertyJsonLd,
  unassignedErrorBody,
  unitJsonLd,
} from "@/lib/jsonld";
import { negotiate } from "@/lib/negotiate";
import { checkRateLimit } from "@/lib/ratelimit";
import { getRegistry } from "@/lib/registry";
import {
  malformedHtml,
  propertyHtml,
  unassignedHtml,
  unitHtml,
} from "@/lib/resolver-html";
import { parseRoomId } from "@/lib/roomid";

export const dynamic = "force-dynamic";

const BASE_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "public, max-age=3600",
  Link: '<https://openroomid.org/spec/1.0>; rel="describedby"',
};

function jsonResponse(
  body: unknown,
  status: number,
  extra: Record<string, string> = {},
): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: {
      ...BASE_HEADERS,
      "Content-Type": "application/ld+json; charset=utf-8",
      ...extra,
    },
  });
}

function htmlResponse(
  html: string,
  status: number,
  extra: Record<string, string> = {},
): NextResponse {
  return new NextResponse(html, {
    status,
    headers: {
      ...BASE_HEADERS,
      "Content-Type": "text/html; charset=utf-8",
      ...extra,
    },
  });
}

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: rawSegment } = await params;

  const rate = checkRateLimit(clientIp(req));
  if (!rate.allowed) {
    return jsonResponse(
      { error: "rate_limited", message: "Limit is 60 requests per minute per IP." },
      429,
      {
        "Retry-After": String(rate.retryAfterSeconds),
        "Cache-Control": "no-store",
      },
    );
  }

  const { identifier, json } = negotiate({
    accept: req.headers.get("accept"),
    pathSegment: decodeURIComponent(rawSegment),
    formatParam: req.nextUrl.searchParams.get("format"),
  });

  const parsed = parseRoomId(identifier);
  if (!parsed.ok) {
    return json
      ? jsonResponse(malformedErrorBody(parsed.error.code, parsed.error.message), 400)
      : htmlResponse(malformedHtml(identifier, parsed.error.message), 400);
  }

  const registry = getRegistry();
  const origin = req.nextUrl.origin;
  const value = parsed.value;

  if (value.kind === "property") {
    const property = await registry.getProperty(value.lookupKey);
    if (!property) {
      return json
        ? jsonResponse(unassignedErrorBody(value.canonical), 404)
        : htmlResponse(unassignedHtml(value.canonical), 404);
    }
    if (property.status === "superseded" && property.supersededBy) {
      const location = `${origin}/${property.supersededBy}${json ? ".json" : ""}`;
      const body = propertyJsonLd(property, [], origin);
      return json
        ? jsonResponse(body, 301, { Location: location })
        : new NextResponse(null, {
            status: 301,
            headers: { ...BASE_HEADERS, Location: location },
          });
    }
    const units = await registry.getUnitsForProperty(property.propertyCode);
    return json
      ? jsonResponse(propertyJsonLd(property, units, origin), 200)
      : htmlResponse(propertyHtml(property, units), 200);
  }

  const foundUnit = await registry.getUnit(value.lookupKey);
  if (!foundUnit) {
    return json
      ? jsonResponse(unassignedErrorBody(value.canonical), 404)
      : htmlResponse(unassignedHtml(value.canonical), 404);
  }
  if (foundUnit.status === "superseded" && foundUnit.supersededBy) {
    const location = `${origin}/${foundUnit.supersededBy}${json ? ".json" : ""}`;
    const property = await registry.getProperty(foundUnit.propertyCode);
    const body = unitJsonLd(foundUnit, property, origin);
    return json
      ? jsonResponse(body, 301, { Location: location })
      : new NextResponse(null, {
          status: 301,
          headers: { ...BASE_HEADERS, Location: location },
        });
  }
  const property = await registry.getProperty(foundUnit.propertyCode);
  return json
    ? jsonResponse(unitJsonLd(foundUnit, property, origin), 200)
    : htmlResponse(unitHtml(foundUnit, property), 200);
}
