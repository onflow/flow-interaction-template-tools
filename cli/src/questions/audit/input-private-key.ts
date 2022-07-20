import inquirer from "inquirer"
import {File} from "../../utils/file/read-files"
import {iAuditMonad} from "../../utils/audit/audit-monad"
import {logger} from "../../utils/logger"

export async function question(templateMonad: iAuditMonad): Promise<iAuditMonad> {
    if (templateMonad.privateKey !== undefined) return templateMonad

    let isAdvancedKeyFormat = typeof templateMonad?.account?.key === "object"

    let priKey;
    if (isAdvancedKeyFormat) {
        priKey = templateMonad?.account?.key.privateKey
    } else {
        priKey = templateMonad?.account?.key
    }
  
    return {
        ...templateMonad,
        privateKey: priKey
    }
}