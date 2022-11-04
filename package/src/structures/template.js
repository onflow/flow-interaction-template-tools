import * as fcl from "@onflow/fcl";
import {
  TYPE,
  MESSAGES,
  INTERFACE,
  DEPENDENCIES,
  ARGUMENTS,
  CADENCE,
} from "../tags";

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

  template.data.type = type.xform();
  template.data.interface = iface.xform();
  template.data.messages = messages.xform();
  template.data.cadence = cadence.xform();
  template.data.dependencies = dependencies.xform();
  template.data.arguments = args.xform();

  template.id = await fcl.InteractionTemplateUtils.generateTemplateId({
    template,
  });

  console.log(JSON.stringify(template));

  return template;
}
