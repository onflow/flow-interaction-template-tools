import {File} from "../file/read-files"

export interface iAuditMonad {
    flowJSON?: {[key: string]: any},
    file: File,
    id?: string,
    hashAlg?: string,
    sigAlg?: string,
    keyId?: number,
    privateKey?: string,
    account?: {[key: string]: any}
    templateId?: string,
    signerAddress?: string,
    signerKeyId?: number,
    signerSignature?: string,
}

export const generateAuditMonad = (file: File, flowJSON?: {[key: string]: any}): iAuditMonad => ({
    flowJSON,
    file,
    templateId: JSON.parse(file.content).id
})