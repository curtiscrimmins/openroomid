"use client";

import { useActionState } from "react";

import { ROLES } from "@/data/roles";

import { submitApplication, type ApplyState } from "./actions";

const initial: ApplyState = { status: "idle", message: "" };

export function ApplyForm() {
  const [state, action, pending] = useActionState(submitApplication, initial);

  if (state.status === "sent") {
    return (
      <div className="front-matter" role="status">
        <p>{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="max-w-xl space-y-4">
      <label className="block">
        <span className="label-caps">Name</span>
        <input name="name" required autoComplete="name" className="field mt-1" />
      </label>
      <label className="block">
        <span className="label-caps">Email</span>
        <input name="email" type="email" required autoComplete="email" className="field mt-1" />
      </label>
      <label className="block">
        <span className="label-caps">Role</span>
        <select name="role" required defaultValue="" className="field mt-1">
          <option value="" disabled>
            Choose a role
          </option>
          {ROLES.map((r) => (
            <option key={r.id} value={r.id}>
              {r.title}
            </option>
          ))}
          <option value="not-sure">Not sure yet</option>
        </select>
      </label>
      <label className="block">
        <span className="label-caps">Current employer or affiliations</span>
        <input
          name="affiliation"
          required
          placeholder="Write none if you have none"
          className="field mt-1"
        />
      </label>
      <label className="block">
        <span className="label-caps">What you would bring</span>
        <textarea name="note" rows={5} maxLength={4000} className="field mt-1" />
      </label>
      <button type="submit" disabled={pending} className="btn">
        {pending ? "Sending" : "Send application"}
      </button>
      {state.status === "error" && (
        <p className="text-sm text-error" role="alert">
          {state.message}
        </p>
      )}
    </form>
  );
}
