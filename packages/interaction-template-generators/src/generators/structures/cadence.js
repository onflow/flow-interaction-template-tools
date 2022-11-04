import * as fcl from "@onflow/fcl";
import { CADENCE } from "../tags.js";

export function cadence(cadence) {
  fcl.invariant(
    cadence != undefined,
    "generateCadence(cadence) Error - cadence must be defined"
  );
  fcl.invariant(
    typeof cadence === "string",
    "generateCadence(cadence) Error - cadence must be a string"
  );

  return {
    tag: CADENCE,
    xform: async () => cadence,
    cadence,
  };
}
