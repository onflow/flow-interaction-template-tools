import {iAuditMonad} from "./audit-monad"
import crypto from "crypto"

const template = `{
    "f_type": "InteractionTemplateAudit",
    "f_vsn": "1.0.0",
    "id": "",
    "data": {
      "id": "",
      "signer": {
        "address": "",
        "key_id": 1,
        "signature": ""
      }
    }
  }`

const genTemplate = () => JSON.parse(template)

export async function generateAudit({
    templateId,
    signerAddress,
    signerKeyId,
    signerSignature,
}: iAuditMonad) {
    let template = genTemplate()
    template.data.id = templateId
    template.data.signer.address = signerAddress
    template.data.signer.key_id = signerKeyId
    template.data.signer.signature = signerSignature

    template.id = crypto.createHash("sha256").update(JSON.stringify(template.data)).digest("hex")

    return template
}