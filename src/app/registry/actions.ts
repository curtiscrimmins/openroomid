"use server";

import { createClient } from "@supabase/supabase-js";

export interface IntakeState {
  status: "idle" | "sent" | "error";
  message: string;
}

export async function submitRegistrationRequest(
  _prev: IntakeState,
  formData: FormData,
): Promise<IntakeState> {
  const propertyName = String(formData.get("property_name") ?? "").trim();
  const contactEmail = String(formData.get("contact_email") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();
  const roomCountRaw = String(formData.get("room_count") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!propertyName || !contactEmail) {
    return {
      status: "error",
      message: "Property name and contact email are required.",
    };
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contactEmail)) {
    return { status: "error", message: "That email address does not parse." };
  }

  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) {
    return {
      status: "error",
      message:
        "The intake database is not configured yet. Email curtis@roomza.com instead; the request is identical.",
    };
  }

  const roomCount = roomCountRaw ? Number.parseInt(roomCountRaw, 10) : null;
  const supabase = createClient(url, secretKey);
  const { error } = await supabase.from("registration_requests").insert({
    property_name: propertyName,
    contact_email: contactEmail,
    address: address || null,
    website: website || null,
    room_count: Number.isFinite(roomCount) ? roomCount : null,
    message: message || null,
  });

  if (error) {
    return {
      status: "error",
      message:
        "The request could not be stored. Email curtis@roomza.com instead; the request is identical.",
    };
  }

  return {
    status: "sent",
    message:
      "Request received. The registrar will reply to the contact address you gave.",
  };
}
