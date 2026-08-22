"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { parseRoomId } from "@/lib/roomid";

export function ResolverBox() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const result = parseRoomId(value);
    if (!result.ok) {
      setError(result.error.message);
      return;
    }
    setError(null);
    router.push(`/${result.value.canonical}`);
  }

  return (
    <form onSubmit={submit} className="my-2">
      <div className="flex max-w-xl gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
          placeholder="7QM4KX92-1412-B"
          spellCheck={false}
          autoComplete="off"
          aria-label="roomID to resolve"
          className="w-full border border-rule bg-field px-3 py-2 font-mono text-[0.95rem] outline-none focus:border-accent"
        />
        <button type="submit" className="btn shrink-0">
          Resolve
        </button>
      </div>
      {error ? (
        <p className="mt-2 max-w-xl text-[0.88rem] text-error">{error}</p>
      ) : (
        <p className="mt-2 text-[0.88rem] text-muted">
          Accepts a full unit identifier, a property code, or a rid: URI.
        </p>
      )}
    </form>
  );
}
