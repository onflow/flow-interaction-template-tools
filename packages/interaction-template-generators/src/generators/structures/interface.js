import * as fcl from "@onflow/fcl";
import { INTERFACE } from "../tags";

export function iface(iface) {
  fcl.invariant(
    iface != undefined,
    "generateInterface(iface) Error - iface must be defined"
  );
  fcl.invariant(
    typeof iface === "string",
    "generateInterface(iface) Error - iface must be a string"
  );

  return {
    tag: INTERFACE,
    xform: () => iface,
    iface,
  };
}
