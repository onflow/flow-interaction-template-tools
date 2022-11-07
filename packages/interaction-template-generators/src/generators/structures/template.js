import * as fcl from "@onflow/fcl";
import {
  TYPE,
  MESSAGES,
  INTERFACE,
  DEPENDENCIES,
  ARGUMENTS,
  CADENCE,
} from "../tags";
import { type as generateType } from "./type";
import { iface as generateIface } from "./interface";
import { cadence as generateCadence } from "./cadence";
import { messages as generateMessages } from "./messages";
import { dependencies as generateDependencies } from "./dependencies";
import { args as generateArguments } from "./arguments";

const _template = `{
  "f_type": "InteractionTemplate",
  "f_version": "1.0.0",
  "id": "",
  "data": {
    "type": "",
    "interface": "",
    "messages": {},
    "cadence": "",
    "dependencies": {},
    "arguments": {}
  }   
}`;

const genTemplate = () => JSON.parse(_template);

export async function template({
  type,
  iface,
  messages,
  cadence,
  dependencies,
  args,
}) {
  if (typeof type === "string") {
    type = generateType(type);
  }
  if (typeof iface === "string") {
    iface = generateIface(iface);
  }
  if (typeof cadence === "string") {
    cadence = generateCadence(cadence);
  }
  if (Array.isArray(messages)) {
    messages = generateMessages(messages);
  }
  if (Array.isArray(dependencies)) {
    dependencies = generateDependencies(dependencies);
  }
  if (Array.isArray(args)) {
    args = generateArguments(args);
  }

  fcl.invariant(
    typeof type === "object",
    "generateTemplate({ type }) Error: type must be an object"
  );
  fcl.invariant(
    type.tag === TYPE,
    `generateTemplate({ type ) Error: type must be a ${TYPE}`
  );

  fcl.invariant(
    typeof iface === "object",
    "generateTemplate({ iface ) Error: iface must be an object"
  );
  fcl.invariant(
    iface.tag === INTERFACE,
    `generateTemplate({ iface ) Error: iface must be a ${INTERFACE}`
  );

  fcl.invariant(
    typeof messages === "object",
    "generateTemplate({ iface ) Error: iface must be an object"
  );
  fcl.invariant(
    messages.tag === MESSAGES,
    `generateTemplate({ messages ) Error: messages must be a ${MESSAGES}`
  );

  fcl.invariant(
    typeof cadence === "object",
    "generateTemplate({ cadence ) Error: cadence must be an object"
  );
  fcl.invariant(
    cadence.tag === CADENCE,
    `generateTemplate({ cadence ) Error: cadence must be a ${CADENCE}`
  );

  fcl.invariant(
    typeof dependencies === "object",
    "generateTemplate({ dependencies ) Error: dependencies must be an object"
  );
  fcl.invariant(
    dependencies.tag === DEPENDENCIES,
    `generateTemplate({ dependencies ) Error: dependencies must be a ${DEPENDENCIES}`
  );

  fcl.invariant(
    typeof args === "object",
    "generateTemplate({ args ) Error: args must be an object"
  );
  fcl.invariant(
    args.tag === ARGUMENTS,
    `generateTemplate({ args ) Error: args must be a ${ARGUMENTS}`
  );

  let template = genTemplate();

  template.data.type = await type.xform();
  template.data.interface = await iface.xform();
  template.data.messages = await messages.xform();
  template.data.cadence = await cadence.xform();
  template.data.dependencies = await dependencies.xform();
  template.data.arguments = await args.xform();

  template.id = await fcl.InteractionTemplateUtils.generateTemplateId({
    template,
  });

  return template;
}
