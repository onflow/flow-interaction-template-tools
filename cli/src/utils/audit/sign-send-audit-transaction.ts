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
    import FlowInteractionAudit from 0xFlowInteractionAudit

    transaction(templateId: String) {
      let flowInteractionAuditManagerPrivateRef: &FlowInteractionAudit.FlowInteractionAuditManager{FlowInteractionAudit.FlowInteractionAuditManagerPrivate}
    
      prepare(account: AuthAccount) {
        if account.borrow<&FlowInteractionAudit.FlowInteractionAuditManager>(from: FlowInteractionAudit.FlowInteractionAuditManagerStoragePath) == nil {
          let flowInteractionAuditManager <- FlowInteractionAudit.createFlowInteractionAuditManager()
    
          account.save(
            <- flowInteractionAuditManager, 
            to: FlowInteractionAudit.FlowInteractionAuditManagerStoragePath,
          )
                
          account.link<&FlowInteractionAudit.FlowInteractionAuditManager{FlowInteractionAudit.FlowInteractionAuditManagerPublic}>(
            FlowInteractionAudit.FlowInteractionAuditManagerPublicPath,
            target: FlowInteractionAudit.FlowInteractionAuditManagerStoragePath
          )
    
          account.link<&FlowInteractionAudit.FlowInteractionAuditManager{FlowInteractionAudit.FlowInteractionAuditManagerPrivate}>(
            FlowInteractionAudit.FlowInteractionAuditManagerPrivatePath,
            target: FlowInteractionAudit.FlowInteractionAuditManagerStoragePath
          )
        }

        self.flowInteractionAuditManagerPrivateRef = 
          account.borrow<&FlowInteractionAudit.FlowInteractionAuditManager{FlowInteractionAudit.FlowInteractionAuditManagerPrivate}>(from: FlowInteractionAudit.FlowInteractionAuditManagerStoragePath)
            ?? panic("Could not borrow ref to FlowInteractionAuditManagerPrivate")
      }
    
      execute {
        self.flowInteractionAuditManagerPrivateRef.addAudit(templateId: templateId)
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
