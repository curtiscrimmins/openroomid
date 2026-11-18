"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import type { OpenQuestion } from "@/data/open-questions";
import { castVote } from "@/app/votes/actions";

function QuestionCard({
  q,
  initialCounts,
  initialMine,
}: {
  q: OpenQuestion;
  initialCounts: Record<string, number>;
  initialMine: string | null;
}) {
  const [counts, setCounts] = useState(initialCounts);
  const [mine, setMine] = useState(initialMine);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const voted = mine !== null;

  function vote(optionId: string) {
    if (optionId === mine) return;
    setError(null);
    start(async () => {
      const res = await castVote(q.id, optionId);
      if (res.ok) {
        setCounts(res.counts);
        setMine(res.mine);
      } else {
        setError(res.message);
      }
    });
  }

  return (
    <fieldset className="question" id={`q-${q.id}`} aria-busy={pending}>
      <legend className="question-title">{q.question}</legend>
      <p className="question-context">
        {q.context} <Link href={`/spec/1.0#${q.specSection}`}>{q.specLabel}</Link>
      </p>
      <div className="question-options">
        {q.options.map((o) => {
          const n = counts[o.id] ?? 0;
          const pct = total ? Math.round((n / total) * 100) : 0;
          const chosen = mine === o.id;
          return (
            <button
              key={o.id}
              type="button"
              className="option"
              aria-pressed={chosen}
              disabled={pending}
              onClick={() => vote(o.id)}
            >
              {voted && (
                <span
                  aria-hidden
                  className="option-bar"
                  style={{ transform: `scaleX(${pct / 100})` }}
                />
              )}
              <span className="option-label">{o.label}</span>
              {voted && (
                <span className="option-count">
                  {pct}%<span className="sr-only">, {n} of {total} votes</span>
                </span>
              )}
            </button>
          );
        })}
      </div>
      <p className="question-meta" aria-live="polite">
        {error ? (
          <span className="text-error">{error}</span>
        ) : voted ? (
          <>
            {total} {total === 1 ? "vote" : "votes"}. You can change your vote.
          </>
        ) : (
          "Results show after you vote."
        )}
      </p>
    </fieldset>
  );
}

export function OpenQuestions({
  questions,
  tallies,
  mine,
}: {
  questions: OpenQuestion[];
  tallies: Record<string, Record<string, number>>;
  mine: Record<string, string>;
}) {
  return (
    <div className="questions">
      {questions.map((q) => (
        <QuestionCard
          key={q.id}
          q={q}
          initialCounts={tallies[q.id] ?? {}}
          initialMine={mine[q.id] ?? null}
        />
      ))}
    </div>
  );
}
