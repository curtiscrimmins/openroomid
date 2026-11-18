"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * A toggletip: a small "Why?" button that reveals a short explanation.
 * Opens on tap or click, on keyboard focus at once, and on hover after a
 * short delay. Escape or a tap elsewhere closes it.
 */
export function Hint({
  children,
  label = "Why?",
  align = "start",
}: {
  children: React.ReactNode;
  label?: string;
  align?: "start" | "end";
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLSpanElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onPointer(e: PointerEvent) {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  function clearHover() {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  }

  return (
    <span
      ref={root}
      className="hint"
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        clearHover();
        hoverTimer.current = setTimeout(() => setOpen(true), 500);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        clearHover();
        setOpen(false);
      }}
    >
      <button
        type="button"
        className="hint-trigger"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          clearHover();
          setOpen((v) => !v);
        }}
        onFocus={(e) => {
          if (e.target.matches(":focus-visible")) setOpen(true);
        }}
        onBlur={() => setOpen(false)}
      >
        {label}
      </button>
      <span
        id={id}
        role="status"
        className={`hint-body ${align === "end" ? "hint-end" : ""}`}
        hidden={!open}
      >
        {open ? children : null}
      </span>
    </span>
  );
}
