"use server";

import { cookies, headers } from "next/headers";

import { findOption } from "@/data/open-questions";
import { checkRateLimit } from "@/lib/ratelimit";
import { VOTER_COOKIE, getVoteStore } from "@/lib/votes";

export type VoteResult =
  | { ok: true; counts: Record<string, number>; mine: string }
  | { ok: false; message: string };

export async function castVote(questionId: string, optionId: string): Promise<VoteResult> {
  if (!findOption(questionId, optionId)) {
    return { ok: false, message: "That question or answer is not on the list." };
  }

  const jar = await cookies();
  let voterId = jar.get(VOTER_COOKIE)?.value;
  if (!voterId || !/^[0-9a-f-]{36}$/.test(voterId)) {
    voterId = crypto.randomUUID();
    jar.set(VOTER_COOKIE, voterId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!checkRateLimit(`vote:${ip}`).allowed || !checkRateLimit(`vote:${voterId}`).allowed) {
    return { ok: false, message: "Too many votes from here in the last minute. Try again shortly." };
  }

  try {
    const store = getVoteStore();
    await store.cast(voterId, questionId, optionId);
    const tallies = await store.tallies();
    return { ok: true, counts: tallies[questionId] ?? {}, mine: optionId };
  } catch {
    return { ok: false, message: "The vote was not saved. Try again." };
  }
}
