import * as fcl from "@onflow/fcl";
import { MESSAGE_TRANSLATION, MESSAGE, MESSAGES } from "../tags.js";

export function messageTranslation({ bcp47tag, translation }) {
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
    xform: async () => ({ [bcp47tag]: translation }),
    bcp47tag,
    translation,
  };
}

export function message({ tag, translations = [] }) {
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
    xform: async () => ({
      [tag]: {
        i18n: await translations.reduce(
          async (acc, translation) => ({
            ...(await acc),
            ...(await translation.xform()),
          }),
          Promise.resolve({})
        ),
      },
    }),
    translations,
  };
}

export function messages(messages = []) {
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
    xform: async () =>
      await messages.reduce(
        async (acc, msg) => ({ ...(await acc), ...(await msg.xform()) }),
        Promise.resolve({})
      ),
    messages,
  };
}
