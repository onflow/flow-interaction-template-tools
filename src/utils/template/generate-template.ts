import crypto from "crypto"
import * as fcl from "@onflow/fcl"
import { iTemplateMonad } from "./template-monad"

const template = `{
    "f_type": "InteractionTemplate",
    "f_vsn": "1.0.0",
    "id": "",
    "data": {
      "type": "",
      "interface": "",
      "messages": {},
      "cadence": "",
      "dependencies": {},
      "arguments": {}
    }   
}`

const genTemplate = () => JSON.parse(template)

interface iGenerateTemplate {
    type: string,
    iface: string,
    // author: string,
    // version: string,
    messages: { [key: string]: any },
    cadence: string,
    dependencies: { [key: string]: any },
    args: { [key: string]: any },
}

export async function generateTemplate({
    type,
    iface,
    // author,
    // version,
    messages,
    cadence,
    dependencies,
    args,
}: iTemplateMonad) {
    let template = genTemplate()
    template.data.type = type
    template.data.interface = iface
    // template.author = author
    // template.data.version = version
    template.data.messages = messages
    template.data.cadence = cadence
    template.data.dependencies = dependencies
    template.data.arguments = args

    template.id = await fcl.InteractionTemplateUtils.generateTemplateId({ template })

    return template
}
