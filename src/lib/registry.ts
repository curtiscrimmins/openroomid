/**
 * Read-only access to the registry.
 *
 * Backend selection: when SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are
 * set, reads go to Supabase. Otherwise the in-memory demonstration
 * dataset serves the same records, so the site works locally and in
 * previews before a database exists. Both backends match units on the
 * uppercased lookup key; canonical casing is preserved in the record.
 */

import type { RecordStatus } from "@/data/demo-registry";
import { demoRegistry } from "@/lib/registry-demo";
import { supabaseRegistry } from "@/lib/registry-supabase";

export interface PropertyRecord {
  propertyCode: string;
  name: string;
  address: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  status: RecordStatus;
  assignedAt: string;
  supersededBy: string | null;
  isDemo: boolean;
}

export interface UnitRecord {
  roomId: string;
  propertyCode: string;
  roomDesignator: string;
  unitSuffix: string;
  displayName: string | null;
  floorLevel: string | null;
  status: RecordStatus;
  assignedAt: string;
  supersededBy: string | null;
  isDemo: boolean;
}

export interface RegistryBackend {
  /** Case-insensitive unit lookup by canonical-form identifier. */
  getUnit(lookupKey: string): Promise<UnitRecord | null>;
  /** Property lookup by normalized (uppercase) property code. */
  getProperty(propertyCode: string): Promise<PropertyRecord | null>;
  /** All units registered under a property, for containsPlace. */
  getUnitsForProperty(propertyCode: string): Promise<UnitRecord[]>;
}

export function getRegistry(): RegistryBackend {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY) {
    return supabaseRegistry();
  }
  return demoRegistry();
}
