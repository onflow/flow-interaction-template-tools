import crypto from "crypto"

const template = `{
    "f_type": "InteractionTemplate",
    "f_vsn": "1.0.0",
    "id": "",
    "data": {
      "type": "",
      "interface": "",
      "author": {},
      "version": "",
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
    version: string,
    messages: { [key: string]: any },
    cadence: string,
    dependencies: { [key: string]: any },
    args: { [key: string]: any },
}

export function generateTemplate({
    type,
    iface,
    // author,
    version,
    messages,
    cadence,
    dependencies,
    args,
}: iGenerateTemplate) {
    let template = genTemplate()
    template.data.type = type
    template.data.interface = iface
    // template.author = author
    template.data.version = version
    template.data.messages = messages
    template.data.cadence = cadence
    template.dependencies = dependencies
    template.data.arguments = args

    template.id = crypto.createHash("sha256").update(JSON.stringify(template)).digest("hex")

    return template
}
