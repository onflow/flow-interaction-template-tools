import * as fcl from "@onflow/fcl";
import { TYPE } from "../tags.js";

export function type(type) {
  fcl.invariant(
    typeof type === "string",
    "generateType(type) Error - type must be a string"
  );

  return {
    tag: TYPE,
    xform: () => type,
    type,
  };
}
