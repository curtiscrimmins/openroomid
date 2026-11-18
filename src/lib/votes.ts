/**
 * Storage for the nonbinding public votes on open questions.
 *
 * Backend selection mirrors the registry: Supabase when SUPABASE_URL and
 * SUPABASE_SECRET_KEY are set, otherwise a local JSON file in development,
 * or memory on a serverless host with no database. One vote per question
 * per voter; voting again replaces the earlier choice. A voter is an
 * anonymous random ID held in a cookie. Nothing else is stored.
 */

import { promises as fs } from "node:fs";
import path from "node:path";

import { createClient } from "@supabase/supabase-js";

/** optionId to count, per question. */
export type Tallies = Record<string, Record<string, number>>;

export interface VoteStore {
  tallies(): Promise<Tallies>;
  votesFor(voterId: string): Promise<Record<string, string>>;
  cast(voterId: string, questionId: string, optionId: string): Promise<void>;
}

type VoteMap = Record<string, Record<string, string>>; // question -> voter -> option

export function tally(votes: VoteMap): Tallies {
  const out: Tallies = {};
  for (const [questionId, byVoter] of Object.entries(votes)) {
    const counts: Record<string, number> = {};
    for (const optionId of Object.values(byVoter)) {
      counts[optionId] = (counts[optionId] ?? 0) + 1;
    }
    out[questionId] = counts;
  }
  return out;
}

function mapStore(load: () => Promise<VoteMap>, save: (m: VoteMap) => Promise<void>): VoteStore {
  return {
    async tallies() {
      return tally(await load());
    },
    async votesFor(voterId) {
      const votes = await load();
      const mine: Record<string, string> = {};
      for (const [q, byVoter] of Object.entries(votes)) {
        if (byVoter[voterId]) mine[q] = byVoter[voterId];
      }
      return mine;
    },
    async cast(voterId, questionId, optionId) {
      const votes = await load();
      votes[questionId] = { ...(votes[questionId] ?? {}), [voterId]: optionId };
      await save(votes);
    },
  };
}

const memory: VoteMap = {};

function memoryStore(): VoteStore {
  return mapStore(
    async () => memory,
    async (m) => {
      Object.assign(memory, m);
    },
  );
}

function fileStore(): VoteStore {
  const file = path.join(process.cwd(), ".data", "question-votes.json");
  return mapStore(
    async () => {
      try {
        return JSON.parse(await fs.readFile(file, "utf8")) as VoteMap;
      } catch {
        return {};
      }
    },
    async (m) => {
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(file, JSON.stringify(m, null, 2));
    },
  );
}

function supabaseStore(): VoteStore {
  const db = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SECRET_KEY as string,
  );
  return {
    async tallies() {
      const { data, error } = await db
        .from("question_tallies")
        .select("question_id, option_id, votes");
      if (error) throw new Error(`vote read failed: ${error.message}`);
      const out: Tallies = {};
      for (const row of data ?? []) {
        out[row.question_id] = { ...(out[row.question_id] ?? {}), [row.option_id]: Number(row.votes) };
      }
      return out;
    },
    async votesFor(voterId) {
      const { data, error } = await db
        .from("question_votes")
        .select("question_id, option_id")
        .eq("voter_id", voterId);
      if (error) throw new Error(`vote read failed: ${error.message}`);
      return Object.fromEntries((data ?? []).map((r) => [r.question_id, r.option_id]));
    },
    async cast(voterId, questionId, optionId) {
      const { error } = await db.from("question_votes").upsert({
        question_id: questionId,
        voter_id: voterId,
        option_id: optionId,
        updated_at: new Date().toISOString(),
      });
      if (error) throw new Error(`vote write failed: ${error.message}`);
    },
  };
}

export function getVoteStore(): VoteStore {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY) return supabaseStore();
  if (process.env.VERCEL) return memoryStore();
  return fileStore();
}

export const VOTER_COOKIE = "orid_voter";
