import {iAuditMonad} from "./audit-monad"
import * as fcl from "@onflow/fcl"
import {signMessage} from "../crypto/sign"

export async function signSendAuditTransaction(auditMonad: iAuditMonad) {
  const authzFunction = async (account: any) => {
    return {
      ...account,
      tempId: `${auditMonad.signerAddress}-${auditMonad.signerKeyId}`,
      addr: auditMonad.signerAddress,
      keyId: Number(auditMonad.signerKeyId),
      signingFunction: async (signable: any) => {
        return {
          addr: auditMonad.signerAddress,
          keyId: Number(auditMonad.signerKeyId),
          signature: await signMessage(
            auditMonad.privateKey!,
            auditMonad.sigAlg!,
            auditMonad.hashAlg!,
            signable.message,
          ),
        }
      },
    }
  }

  return fcl
  .config()
  .overload({"accessNode.api": auditMonad.accessNodeAPI}, async () =>
    fcl.decode(
      await fcl.send([
        fcl.transaction(`
          import FlowInteractionTemplateAudit from 0xFlowInteractionTemplateAudit

          transaction(templateId: String) {
            let flowInteractionTemplateAuditManagerPrivateRef: &FlowInteractionTemplateAudit.AuditManager{FlowInteractionTemplateAudit.AuditManagerPrivate}
            prepare(account: AuthAccount) {
              if account.borrow<&FlowInteractionTemplateAudit.AuditManager>(from: FlowInteractionTemplateAudit.AuditManagerStoragePath) == nil {
                let FlowInteractionTemplateAuditManager <- FlowInteractionTemplateAudit.createAuditManager()
          
                account.save(
                  <- FlowInteractionTemplateAuditManager, 
                  to: FlowInteractionTemplateAudit.AuditManagerStoragePath,
                )
                      
                account.link<&FlowInteractionTemplateAudit.AuditManager{FlowInteractionTemplateAudit.AuditManagerPublic}>(
                  FlowInteractionTemplateAudit.AuditManagerPublicPath,
                  target: FlowInteractionTemplateAudit.AuditManagerStoragePath
                )
          
                account.link<&FlowInteractionTemplateAudit.AuditManager{FlowInteractionTemplateAudit.AuditManagerPrivate}>(
                  FlowInteractionTemplateAudit.AuditManagerPrivatePath,
                  target: FlowInteractionTemplateAudit.AuditManagerStoragePath
                )
              }
          
              self.flowInteractionTemplateAuditManagerPrivateRef = 
                account.borrow<&FlowInteractionTemplateAudit.AuditManager{FlowInteractionTemplateAudit.AuditManagerPrivate}>(from: FlowInteractionTemplateAudit.AuditManagerStoragePath)
                  ?? panic("Could not borrow ref to AuditManagerPrivate")
            }
          
            execute {
              self.flowInteractionTemplateAuditManagerPrivateRef.addAudit(templateId: templateId)
            }
          }
    `),
        fcl.args([
          fcl.arg(auditMonad.templateId!, fcl.t.String as fcl.FType),
        ]),
        fcl.authorizations([authzFunction]),
        fcl.proposer(authzFunction),
        fcl.payer(authzFunction),
        fcl.limit(9999),
      ]),
    ),
  )
}
