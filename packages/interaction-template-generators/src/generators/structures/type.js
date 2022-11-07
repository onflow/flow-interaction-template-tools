import * as fcl from "@onflow/fcl";
import { TYPE } from "../tags.js";

export function type(type) {
  fcl.invariant(
    typeof type === "string",
    "generateType(type) Error - type must be a string"
  );
  fcl.invariant(
    type === "script" || type === "transaction",
    "generateType(type) Error - type must be either 'script' or 'transaction'"
  );

  return {
    tag: TYPE,
    xform: async () => type,
    type,
  };
}
