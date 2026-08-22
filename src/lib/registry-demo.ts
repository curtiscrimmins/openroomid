import { DEMO_PROPERTY, DEMO_UNITS } from "@/data/demo-registry";
import type { PropertyRecord, RegistryBackend, UnitRecord } from "@/lib/registry";

const properties: PropertyRecord[] = [DEMO_PROPERTY];
const units: UnitRecord[] = DEMO_UNITS;

export function demoRegistry(): RegistryBackend {
  return {
    async getUnit(lookupKey: string) {
      return (
        units.find((u) => u.roomId.toUpperCase() === lookupKey.toUpperCase()) ??
        null
      );
    },
    async getProperty(propertyCode: string) {
      return (
        properties.find(
          (p) => p.propertyCode.toUpperCase() === propertyCode.toUpperCase(),
        ) ?? null
      );
    },
    async getUnitsForProperty(propertyCode: string) {
      return units.filter(
        (u) => u.propertyCode.toUpperCase() === propertyCode.toUpperCase(),
      );
    },
  };
}
