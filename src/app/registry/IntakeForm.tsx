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
        className="field mt-1"
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
      <div className="front-matter">
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
          className="field mt-1"
        />
      </label>
      <button type="submit" disabled={pending} className="btn">
        {pending ? "Sending" : "Request identifiers"}
      </button>
      {state.status === "error" && (
        <p className="text-sm text-error">{state.message}</p>
      )}
    </form>
  );
}
