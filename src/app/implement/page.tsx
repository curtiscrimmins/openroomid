import type { Metadata } from "next";
import Link from "next/link";

import { CopyBlock } from "@/components/CopyBlock";

export const metadata: Metadata = {
  title: "Implementation guide",
  description:
    "Copy-paste schema.org JSON-LD for carrying roomID on room pages, hotel pages, offers, and booking URLs.",
};

const ROOM_BLOCK = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HotelRoom",
  "name": "Room 1412",
  "url": "https://www.example-hotel.com/rooms/1412",
  "identifier": {
    "@type": "PropertyValue",
    "propertyID": "roomID",
    "value": "7QM4KX92-1412-B"
  },
  "containedInPlace": {
    "@type": "Hotel",
    "name": "Example Hotel",
    "identifier": {
      "@type": "PropertyValue",
      "propertyID": "roomID:property",
      "value": "7QM4KX92"
    }
  },
  "sameAs": "https://openroomid.org/7QM4KX92-1412-B"
}
</script>`;

const HOTEL_BLOCK = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Hotel",
  "name": "Example Hotel",
  "url": "https://www.example-hotel.com",
  "identifier": {
    "@type": "PropertyValue",
    "propertyID": "roomID:property",
    "value": "7QM4KX92"
  },
  "sameAs": "https://openroomid.org/7QM4KX92",
  "containsPlace": [
    {
      "@type": "HotelRoom",
      "name": "Room 1412",
      "identifier": {
        "@type": "PropertyValue",
        "propertyID": "roomID",
        "value": "7QM4KX92-1412-B"
      }
    },
    {
      "@type": "HotelRoom",
      "name": "Room 1414",
      "identifier": {
        "@type": "PropertyValue",
        "propertyID": "roomID",
        "value": "7QM4KX92-1414-A"
      }
    }
  ]
}
</script>`;

const OFFER_BLOCK = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Offer",
  "itemOffered": {
    "@type": "HotelRoom",
    "name": "Room 1412",
    "identifier": {
      "@type": "PropertyValue",
      "propertyID": "roomID",
      "value": "7QM4KX92-1412-B"
    }
  },
  "price": "189.00",
  "priceCurrency": "USD",
  "availabilityStarts": "2026-09-12",
  "availabilityEnds": "2026-09-13",
  "seller": {
    "@type": "Hotel",
    "name": "Example Hotel",
    "identifier": {
      "@type": "PropertyValue",
      "propertyID": "roomID:property",
      "value": "7QM4KX92"
    }
  }
}
</script>`;

const ACTION_BLOCK = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HotelRoom",
  "name": "Room 1412",
  "identifier": {
    "@type": "PropertyValue",
    "propertyID": "roomID",
    "value": "7QM4KX92-1412-B"
  },
  "potentialAction": {
    "@type": "ReserveAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://book.example-hotel.com/reserve?rid=7QM4KX92-1412-B&checkin={checkin_date}&checkout={checkout_date}",
      "actionPlatform": "https://schema.org/DesktopWebPlatform"
    },
    "result": {
      "@type": "LodgingReservation",
      "name": "Reservation for room 1412"
    }
  }
}
</script>`;

export default function ImplementPage() {
  return (
    <div className="doc">
      <h1>Implementation guide</h1>
      <p>
        This page is for the engineer wiring roomID into a hotel website,
        a booking engine, or a PMS export. Each block below is complete:
        paste it into the page head, replace the example values with your
        own, and you are done. Identifiers come from the registrar; see
        the <Link href="/registry">registry policy</Link> if your property
        does not have them yet.
      </p>
      <p>
        The pattern in all four blocks is the same one:{" "}
        <code>identifier</code> is a schema.org PropertyValue whose{" "}
        <code>propertyID</code> is <code>roomID</code> for a unit or{" "}
        <code>roomID:property</code> for a property, and whose{" "}
        <code>value</code> is the identifier itself.
      </p>

      <h2>A room page</h2>
      <p>
        Put this on the page that describes one physical room. The{" "}
        <code>sameAs</code> link to the resolver lets any consumer of your
        markup verify the identifier against the registry.
      </p>
      <CopyBlock code={ROOM_BLOCK} />

      <h2>A hotel page</h2>
      <p>
        Put this on the property&apos;s main page. Listing units in{" "}
        <code>containsPlace</code> is optional; the property identifier is
        the part that matters. Two units are shown as examples of the
        shape.
      </p>
      <CopyBlock code={HOTEL_BLOCK} />

      <h2>An offer attached to a unit</h2>
      <p>
        A rate belongs to your markup and your systems, never to the
        registry. This block shows the join: the Offer carries your price,
        and <code>itemOffered.identifier</code> pins it to the exact unit,
        so a consumer of the offer knows precisely which room the price is
        for.
      </p>
      <CopyBlock code={OFFER_BLOCK} />

      <h2>Carrying the identifier into booking</h2>
      <p>
        The <code>potentialAction</code> pattern advertises a booking URL
        that carries the identifier as a <code>rid</code> query parameter.
        A system that selected a specific unit upstream can hand the
        selection to your booking flow without losing it. The{" "}
        <code>&#123;checkin_date&#125;</code> and{" "}
        <code>&#123;checkout_date&#125;</code> placeholders follow the
        EntryPoint template convention.
      </p>
      <CopyBlock code={ACTION_BLOCK} />

      <h2>Rules worth knowing</h2>
      <ul>
        <li>
          Emit identifiers in canonical form: uppercase property code,
          designator cased as registered, uppercase suffix.
        </li>
        <li>
          Do not mint identifiers yourself. If an identifier does not
          resolve at openroomid.org, it is not a roomID.
        </li>
        <li>
          When a room is renumbered, the registry supersedes the old
          identifier and redirects to the new one, so stored identifiers
          in your systems keep working. Update your markup to the current
          identifier when convenient.
        </li>
        <li>
          Validate syntax before storing:{" "}
          <Link href="/spec/1.0#section-3">
            section 3 of the specification
          </Link>{" "}
          has the grammar, and the resolver returns 400 with the failing
          rule for anything malformed.
        </li>
      </ul>
    </div>
  );
}
