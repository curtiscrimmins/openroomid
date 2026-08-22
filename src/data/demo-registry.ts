/**
 * Demonstration registry data: El Cortez Hotel & Casino, Las Vegas.
 *
 * This is the single source for demo rows. The seed script writes it to
 * Supabase, and the in-memory registry backend serves it directly when no
 * Supabase project is configured. Every row here carries isDemo: true so
 * it can be cleared once real registrations exist.
 */

export type RecordStatus = "active" | "retired" | "superseded";

export interface DemoProperty {
  propertyCode: string;
  name: string;
  address: string;
  city: string;
  region: string;
  country: string;
  status: RecordStatus;
  assignedAt: string;
  supersededBy: string | null;
  isDemo: boolean;
}

export interface DemoUnit {
  roomId: string;
  propertyCode: string;
  roomDesignator: string;
  unitSuffix: string;
  displayName: string;
  floorLevel: string;
  status: RecordStatus;
  assignedAt: string;
  supersededBy: string | null;
  isDemo: boolean;
}

export const DEMO_PROPERTY: DemoProperty = {
  propertyCode: "7QM4KX92",
  name: "El Cortez Hotel & Casino",
  address: "600 E Fremont St",
  city: "Las Vegas",
  region: "NV",
  country: "US",
  status: "active",
  assignedAt: "2026-08-09",
  supersededBy: null,
  isDemo: true,
};

function unit(
  designator: string,
  suffix: string,
  overrides: Partial<DemoUnit> = {},
): DemoUnit {
  return {
    roomId: `${DEMO_PROPERTY.propertyCode}-${designator}-${suffix}`,
    propertyCode: DEMO_PROPERTY.propertyCode,
    roomDesignator: designator,
    unitSuffix: suffix,
    displayName: `Room ${designator}`,
    floorLevel: designator.slice(0, 2),
    status: "active",
    assignedAt: "2026-08-09",
    supersededBy: null,
    isDemo: true,
    ...overrides,
  };
}

function buildUnits(): DemoUnit[] {
  const units: DemoUnit[] = [];
  for (let floor = 10; floor <= 14; floor++) {
    for (let room = 1; room <= 8; room++) {
      const designator = `${floor}${String(room).padStart(2, "0")}`;
      units.push(unit(designator, "A"));
    }
  }

  // Lifecycle demonstrations. Room 1412 (the canonical example in the
  // specification) carries suffix B: its first identifier was superseded
  // when the unit was rebuilt in a renovation, and resolves to the
  // successor. Room 1407 was converted to storage and is retired; the
  // identifier remains resolvable forever.
  units.push(
    unit("1412", "A", {
      status: "superseded",
      supersededBy: `${DEMO_PROPERTY.propertyCode}-1412-B`,
    }),
    unit("1412", "B"),
  );

  const r1407 = units.find((u) => u.roomDesignator === "1407");
  if (r1407) {
    r1407.status = "retired";
  }

  return units;
}

export const DEMO_UNITS: DemoUnit[] = buildUnits();
