/**
 * Questions the working group has not yet decided, shown on the home page
 * for a nonbinding public vote. Positions are written to be fair to each
 * side. When the working group resolves a question, move it out of this
 * list and record the resolution in the specification and DECISIONS.md.
 * Never change a live option's id: stored votes reference it.
 */

export interface QuestionOption {
  id: string;
  label: string;
}

export interface OpenQuestion {
  id: string;
  question: string;
  context: string;
  specSection: string;
  specLabel: string;
  options: QuestionOption[];
}

export const OPEN_QUESTIONS: OpenQuestion[] = [
  {
    id: "pre-registration",
    question: "May a booking platform register a property that has not claimed its identifiers?",
    context:
      "Pre-registration would cover more rooms faster. It also risks wrong door labels that the hotel must fix later, and leaves open who controls the record until the hotel claims it.",
    specSection: "section-4-3",
    specLabel: "Section 4.3",
    options: [
      { id: "yes-unclaimed", label: "Yes, marked unclaimed until the hotel confirms" },
      { id: "registrar-review", label: "Only after the registrar reviews each one" },
      { id: "operator-only", label: "No, only the hotel or its agent" },
    ],
  },
  {
    id: "composed-units",
    question: "How should a suite made of two rooms behind one door be identified?",
    context:
      "Connecting rooms and lock-off suites are booked both ways: as one space and as two. The registry needs one rule for what counts as the unit.",
    specSection: "section-4-3",
    specLabel: "Section 4.3",
    options: [
      { id: "one-id", label: "One identifier for the suite" },
      { id: "two-linked", label: "Two identifiers, linked as parts of the suite" },
      { id: "three-ids", label: "Both: each room and the suite get identifiers" },
    ],
  },
  {
    id: "shared-units",
    question: "In a hostel dormitory, what gets the identifier?",
    context:
      "Guests book a bed, but the bed sits inside a room. Identifying beds is precise. Identifying rooms is simpler and matches the door.",
    specSection: "section-4-2",
    specLabel: "Section 4.2",
    options: [
      { id: "room", label: "The room" },
      { id: "bed", label: "Each bed" },
      { id: "both", label: "Both, with each bed inside its room" },
    ],
  },
  {
    id: "check-character",
    question: "Should identifiers carry a check character to catch typos?",
    context:
      "A check character catches mistakes when an identifier is read aloud or copied by hand. It also makes every identifier one character longer.",
    specSection: "section-3",
    specLabel: "Section 3",
    options: [
      { id: "yes-required", label: "Yes, required on every identifier" },
      { id: "optional", label: "Optional: accepted, not required" },
      { id: "no", label: "No, keep identifiers short" },
    ],
  },
  {
    id: "succession",
    question: "If the OpenRoomID Project stops operating, who takes over the registry?",
    context:
      "The public registry dump means the data survives. What is undecided is who runs the resolver and the name, and how that is fixed in advance.",
    specSection: "section-7",
    specLabel: "Section 7",
    options: [
      { id: "standards-body", label: "A named standards body, agreed in advance" },
      { id: "escrow", label: "A neutral party holding the data in escrow" },
      { id: "dump-enough", label: "Nobody. The public dump is enough" },
    ],
  },
];

export function findOption(questionId: string, optionId: string) {
  const question = OPEN_QUESTIONS.find((q) => q.id === questionId);
  const option = question?.options.find((o) => o.id === optionId);
  return question && option ? { question, option } : null;
}
