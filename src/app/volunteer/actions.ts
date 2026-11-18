"use server";

import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

import { findRole } from "@/data/roles";
import { checkRateLimit } from "@/lib/ratelimit";

export interface ApplyState {
  status: "idle" | "sent" | "error";
  message: string;
}

export async function submitApplication(
  _prev: ApplyState,
  formData: FormData,
): Promise<ApplyState> {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const name = get("name");
  const email = get("email");
  const roleId = get("role");
  const affiliation = get("affiliation");
  const note = get("note");

  if (!name || !email || !roleId || !affiliation) {
    return { status: "error", message: "Name, email, role, and affiliation are required." };
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { status: "error", message: "That email address does not look complete." };
  }
  if (roleId !== "not-sure" && !findRole(roleId)) {
    return { status: "error", message: "Pick a role from the list." };
  }
  if (note.length > 4000) {
    return { status: "error", message: "Keep the note under 4,000 characters." };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!checkRateLimit(`apply:${ip}`).allowed) {
    return { status: "error", message: "Too many submissions from here. Try again in a minute." };
  }

  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) {
    return {
      status: "error",
      message: "Applications are not being stored yet. Email registry@openroomid.org with the same details.",
    };
  }

  const { error } = await createClient(url, secretKey)
    .from("volunteer_applications")
    .insert({ name, email, role_id: roleId, affiliation, note: note || null });

  if (error) {
    return {
      status: "error",
      message: "The application was not saved. Email registry@openroomid.org with the same details.",
    };
  }
  return {
    status: "sent",
    message: "Application received. A member of the working group will reply to the address you gave.",
  };
}
