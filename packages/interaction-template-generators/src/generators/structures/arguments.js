import * as fcl from "@onflow/fcl";
import { MESSAGE, ARGUMENT, ARGUMENTS } from "../tags.js";

export function arg({ tag, type, index, messages = [] }) {
  fcl.invariant(
    typeof tag === "string",
    "generateArgument({ tag }) Error: tag must be a string"
  );

  fcl.invariant(
    typeof type === "string",
    "generateArgument({ type }) Error: type must be a string"
  );

  fcl.invariant(
    typeof index === "number",
    "generateArgument({ index }) Error: index must be a number"
  );

  fcl.invariant(
    Array.isArray(messages),
    "generateArgument({ messages }) Error: messages must be an array"
  );

  for (const message of messages) {
    fcl.invariant(
      typeof message === "object",
      "generateArgument({ messages }) Error: each message must be an object"
    );
    fcl.invariant(
      message.tag === MESSAGE,
      `generateArgument({ messages }) Error: each message must be a ${MESSAGE}`
    );
  }

  return {
    tag: ARGUMENT,
    xform: async () => ({
      [tag]: {
        index,
        type,
        messages: await messages.reduce(
          async (acc, msg) => ({ ...(await acc), ...(await msg.xform()) }),
          Promise.resolve({})
        ),
      },
    }),
    tag,
    type,
    index,
    messages,
  };
}

export function args(ags = []) {
  fcl.invariant(
    Array.isArray(ags),
    "generateArguments(args) Error: args must be an array"
  );

  for (const argument of ags) {
    fcl.invariant(
      typeof argument === "object",
      "generateMessages(args) Error: Each argument must be an object"
    );
    fcl.invariant(
      argument.tag === ARGUMENT,
      `generateMessages(args) Error: Each argument must be a ${ARGUMENT}`
    );
  }

  return {
    tag: ARGUMENTS,
    xform: async () =>
      await ags.reduce(
        async (acc, arg) => ({ ...(await acc), ...(await arg.xform()) }),
        Promise.resolve({})
      ),
    ags,
  };
}
