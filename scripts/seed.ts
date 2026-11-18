/**
 * Seed the registry with the El Cortez demonstration data.
 *
 * Usage: npm run seed
 * Requires SUPABASE_URL and SUPABASE_SECRET_KEY in the environment
 * (or .env.local). Idempotent: rows are upserted by primary key.
 */

import { createClient } from "@supabase/supabase-js";
import { DEMO_PROPERTY, DEMO_UNITS } from "../src/data/demo-registry";

const url = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !secretKey) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SECRET_KEY. Set both in .env.local, then run: npm run seed",
  );
  process.exit(1);
}

const supabase = createClient(url, secretKey);

async function main() {
  const propertyRow = {
    property_code: DEMO_PROPERTY.propertyCode,
    name: DEMO_PROPERTY.name,
    address: DEMO_PROPERTY.address,
    city: DEMO_PROPERTY.city,
    region: DEMO_PROPERTY.region,
    country: DEMO_PROPERTY.country,
    is_residence: DEMO_PROPERTY.isResidence,
    claim_status: DEMO_PROPERTY.claimStatus,
    last_confirmed: DEMO_PROPERTY.lastConfirmed,
    status: DEMO_PROPERTY.status,
    assigned_at: DEMO_PROPERTY.assignedAt,
    superseded_by: DEMO_PROPERTY.supersededBy,
    is_demo: DEMO_PROPERTY.isDemo,
  };

  const { error: propertyError } = await supabase
    .from("properties")
    .upsert(propertyRow);
  if (propertyError) {
    throw new Error(`properties upsert failed: ${propertyError.message}`);
  }

  // Two passes: insert all rows without supersession links first, then
  // apply the links, so the self-referencing foreign key never dangles.
  const baseRows = DEMO_UNITS.map((u) => ({
    room_id: u.roomId,
    property_code: u.propertyCode,
    room_designator: u.roomDesignator,
    unit_suffix: u.unitSuffix,
    designator_source: u.designatorSource,
    display_name: u.displayName,
    floor_level: u.floorLevel,
    status: u.status,
    assigned_at: u.assignedAt,
    superseded_by: null as string | null,
    is_demo: u.isDemo,
  }));

  const { error: unitsError } = await supabase.from("units").upsert(baseRows);
  if (unitsError) {
    throw new Error(`units upsert failed: ${unitsError.message}`);
  }

  const linked = DEMO_UNITS.filter((u) => u.supersededBy !== null);
  for (const u of linked) {
    const { error } = await supabase
      .from("units")
      .update({ superseded_by: u.supersededBy })
      .eq("room_id", u.roomId);
    if (error) {
      throw new Error(`link update failed for ${u.roomId}: ${error.message}`);
    }
  }

  console.log(
    `Seeded 1 property and ${DEMO_UNITS.length} units for ${DEMO_PROPERTY.name}.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
