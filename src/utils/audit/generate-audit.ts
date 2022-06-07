import {iAuditMonad} from "./audit-monad"

const template = `{
    "f_type": "InteractionTemplateAudit",
    "f_vsn": "1.0.0",
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

export function generateAudit({
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

    return template
}