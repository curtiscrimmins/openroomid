"use client";

import { useActionState } from "react";

import { submitRegistrationRequest, type IntakeState } from "./actions";

const initialState: IntakeState = { status: "idle", message: "" };

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="label-caps">
        {label}
        {required ? " (required)" : ""}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full border border-rule bg-field px-3 py-2 text-[0.95rem] outline-none focus:border-accent"
      />
    </label>
  );
}

export function IntakeForm() {
  const [state, formAction, pending] = useActionState(
    submitRegistrationRequest,
    initialState,
  );

  if (state.status === "sent") {
    return (
      <div className="border border-rule bg-panel px-4 py-3">
        <p>{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <Field label="Property name" name="property_name" required />
      <Field label="Street address" name="address" />
      <Field label="Contact email" name="contact_email" type="email" required />
      <Field label="Website" name="website" placeholder="https://" />
      <Field label="Approximate number of units" name="room_count" />
      <label className="block">
        <span className="label-caps">Notes</span>
        <textarea
          name="message"
          rows={4}
          className="mt-1 w-full border border-rule bg-field px-3 py-2 text-[0.95rem] outline-none focus:border-accent"
        />
      </label>
      <button type="submit" disabled={pending} className="btn">
        {pending ? "Sending" : "Request identifiers"}
      </button>
      {state.status === "error" && (
        <p className="text-[0.9rem] text-error">{state.message}</p>
      )}
    </form>
  );
}
