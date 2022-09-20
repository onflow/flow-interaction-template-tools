import { iAuditMonad } from "./audit-monad";
import * as fcl from "@onflow/fcl";
import { signMessage } from "../crypto/sign";

export async function signSendAuditTransaction(auditMonad: iAuditMonad) {
  const authzFunction = async (account: any) => {
    // authorization function need to return an account
    return {
      ...account, // bunch of defaults in here, we want to overload some of them though
      tempId: `${auditMonad.signerAddress}-${auditMonad.signerKeyId}`, // tempIds are more of an advanced topic, for 99% of the times where you know the address and keyId you will want it to be a unique string per that address and keyId
      addr: auditMonad.signerAddress, // the address of the signatory
      keyId: Number(auditMonad.signerKeyId), // this is the keyId for the accounts registered key that will be used to sign, make extra sure this is a number and not a string
      signingFunction: async (signable: any) => {
        // Singing functions are passed a signable and need to return a composite signature
        // signable.message is a hex string of what needs to be signed.
        return {
          addr: auditMonad.signerAddress, // needs to be the same as the account.addr
          keyId: Number(auditMonad.signerKeyId), // needs to be the same as account.keyId, once again make sure its a number and not a string
          signature: await signMessage(
            auditMonad.privateKey!,
            auditMonad.sigAlg!,
            auditMonad.hashAlg!,
            signable.message
          ), // this needs to be a hex string of the signature, where signable.message is the hex value that needs to be signed
        };
      },
    };
  };

  return fcl
    .config()
    .overload({ "accessNode.api": auditMonad.accessNodeAPI }, async () =>
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
        ])
      )
    );
}
