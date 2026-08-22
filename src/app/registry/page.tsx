import type { Metadata } from "next";
import Link from "next/link";

import { IntakeForm } from "./IntakeForm";

export const metadata: Metadata = {
  title: "Registry policy",
  description:
    "Who can request roomID identifiers, what assignment costs, and the permanence commitment.",
};

export default function RegistryPage() {
  return (
    <div className="doc">
      <h1>Registry policy</h1>

      <h2>Who can request identifiers</h2>
      <p>
        The operator of a property, or an agent the operator authorizes,
        can request a property code and unit identifiers. You do not need
        to be a customer of the registrar or of anyone else. You do not
        need an account.
      </p>

      <h2>What it costs</h2>
      <p>
        Nothing. Assignment is free, resolution is free, and both will
        stay free. This is a governance commitment of the standard, stated
        normatively in{" "}
        <Link href="/spec/1.0#section-7">section 7 of the specification</Link>
        , not a promotional price.
      </p>

      <h2>How a property claims its codes</h2>
      <ol>
        <li>
          Submit the form below, or email{" "}
          <a href="mailto:curtis@roomza.com">curtis@roomza.com</a> with the
          same information: property name, address, a contact at the
          property, and roughly how many units you operate.
        </li>
        <li>
          The registrar verifies that you operate the property, assigns a
          property code, and sends you a template for your room list.
        </li>
        <li>
          You return the room list: the designator for each unit, as it
          appears on the door. The registrar registers the units and every
          identifier resolves from that day on.
        </li>
      </ol>

      <h2>Permanence</h2>
      <p>
        An identifier, once assigned, resolves forever. The registry does
        not delete records. Rooms that stop existing are marked retired
        and keep resolving; renumbered rooms are superseded and redirect
        to their successor. The full registry is periodically published as
        a public dump so it can outlive its registrar. Details are in{" "}
        <Link href="/spec/1.0#section-5">sections 5</Link> and{" "}
        <Link href="/spec/1.0#section-7">7 of the specification</Link>.
      </p>

      <h2>Request identifiers</h2>
      <IntakeForm />

      <h2>Contact</h2>
      <p>
        Registrar: Roomza, Inc., 228 Park Ave S, New York, NY.{" "}
        <a href="mailto:curtis@roomza.com">curtis@roomza.com</a>
      </p>
    </div>
  );
}
