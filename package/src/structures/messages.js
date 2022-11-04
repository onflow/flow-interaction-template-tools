import * as fcl from "@onflow/fcl";
import { MESSAGE_TRANSLATION, MESSAGE, MESSAGES } from "../tags.js";

export function generateMessageTranslation({ bcp47tag, translation }) {
  fcl.invariant(
    typeof bcp47tag === "string",
    "generateMessage({ bcp47tag }) Error: bcp47tag must be a string"
  );
  fcl.invariant(
    typeof translation === "string",
    "generateMessage({ translation }) Error: translation must be a string"
  );

  return {
    tag: MESSAGE_TRANSLATION,
    xform: () => ({ [bcp47tag]: translation }),
    bcp47tag,
    translation,
  };
}

export function generateMessage({ tag, translations = [] }) {
  fcl.invariant(
    typeof tag === "string",
    "generateMessage({ tag }) Error: tag must be a string"
  );

  fcl.invariant(
    Array.isArray(translations),
    "generateMessage({ translations }) Error: translations must be an array"
  );

  for (const translation of translations) {
    fcl.invariant(
      typeof translation === "object",
      "generateMessage({ translations }) Error: translation must be an object"
    );
    fcl.invariant(
      translation.tag === MESSAGE_TRANSLATION,
      `generateMessage({ translations }) Error: each translation must be a ${MESSAGE_TRANSLATION}`
    );
  }

  return {
    tag: MESSAGE,
    xform: () => ({
      [tag]: {
        i18n: translations.reduce(
          (acc, translation) => ({ ...acc, ...translation.xform() }),
          {}
        ),
      },
    }),
    translations,
  };
}

export function generateMessages(messages = []) {
  fcl.invariant(
    Array.isArray(messages),
    "generateMessages(messages) Error: messages must be an array"
  );

  for (const message of messages) {
    fcl.invariant(
      typeof message === "object",
      "generateMessages(messages) Error: Each message must be an object"
    );
    fcl.invariant(
      message.tag === MESSAGE,
      `generateMessages(messages) Error: Each message must be a ${MESSAGE}`
    );
  }

  return {
    tag: MESSAGES,
    xform: () =>
      messages.reduce((acc, msg) => ({ ...acc, ...msg.xform() }), {}),
    messages,
  };
}
