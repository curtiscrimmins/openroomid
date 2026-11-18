import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type {
  ClaimStatus,
  DesignatorSource,
  RecordStatus,
} from "@/data/demo-registry";
import type { PropertyRecord, RegistryBackend, UnitRecord } from "@/lib/registry";

interface PropertyRow {
  property_code: string;
  name: string;
  address: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  is_residence: boolean;
  claim_status: ClaimStatus;
  last_confirmed: string | null;
  status: RecordStatus;
  assigned_at: string;
  superseded_by: string | null;
  is_demo: boolean;
}

interface UnitRow {
  room_id: string;
  property_code: string;
  room_designator: string;
  unit_suffix: string;
  designator_source: DesignatorSource;
  display_name: string | null;
  floor_level: string | null;
  status: RecordStatus;
  assigned_at: string;
  superseded_by: string | null;
  is_demo: boolean;
}

function toProperty(row: PropertyRow): PropertyRecord {
  return {
    propertyCode: row.property_code,
    name: row.name,
    address: row.is_residence ? null : row.address,
    city: row.city,
    region: row.region,
    country: row.country,
    isResidence: row.is_residence,
    claimStatus: row.claim_status,
    lastConfirmed: row.last_confirmed,
    status: row.status,
    assignedAt: row.assigned_at,
    supersededBy: row.superseded_by,
    isDemo: row.is_demo,
  };
}

function toUnit(row: UnitRow): UnitRecord {
  return {
    roomId: row.room_id,
    propertyCode: row.property_code,
    roomDesignator: row.room_designator,
    unitSuffix: row.unit_suffix,
    designatorSource: row.designator_source,
    displayName: row.display_name,
    floorLevel: row.floor_level,
    status: row.status,
    assignedAt: row.assigned_at,
    supersededBy: row.superseded_by,
    isDemo: row.is_demo,
  };
}

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!client) {
    client = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_PUBLISHABLE_KEY as string,
    );
  }
  return client;
}

export function supabaseRegistry(): RegistryBackend {
  return {
    async getUnit(lookupKey: string) {
      // ilike with no wildcards is a case-insensitive equality match,
      // served by the unique index on upper(room_id).
      const { data, error } = await getClient()
        .from("units")
        .select("*")
        .ilike("room_id", lookupKey)
        .maybeSingle<UnitRow>();
      if (error) throw new Error(`registry read failed: ${error.message}`);
      return data ? toUnit(data) : null;
    },
    async getProperty(propertyCode: string) {
      const { data, error } = await getClient()
        .from("properties")
        .select("*")
        .eq("property_code", propertyCode)
        .maybeSingle<PropertyRow>();
      if (error) throw new Error(`registry read failed: ${error.message}`);
      return data ? toProperty(data) : null;
    },
    async getUnitsForProperty(propertyCode: string) {
      const { data, error } = await getClient()
        .from("units")
        .select("*")
        .eq("property_code", propertyCode)
        .order("room_id")
        .returns<UnitRow[]>();
      if (error) throw new Error(`registry read failed: ${error.message}`);
      return (data ?? []).map(toUnit);
    },
  };
}
