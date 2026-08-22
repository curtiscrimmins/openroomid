"use client";

import { useState } from "react";

export function CopyBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access denied; the user can still select the text.
    }
  }

  return (
    <div className="my-4">
      <div className="flex items-baseline justify-between gap-4">
        {label ? (
          <p className="mb-1 text-[0.88rem] text-muted">{label}</p>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={copy}
          className="btn shrink-0 !px-2.5 !py-1 !text-[0.66rem]"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="mt-1">
        <code>{code}</code>
      </pre>
    </div>
  );
}
