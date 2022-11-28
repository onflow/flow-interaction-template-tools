import inquirer from "inquirer"
import {File} from "../../utils/file/read-files"
import {iAuditMonad} from "../../utils/audit/audit-monad"
import {logger} from "../../utils/logger"

export async function question(templateMonad: iAuditMonad): Promise<iAuditMonad> {
  if (templateMonad.privateKey !== undefined) return templateMonad

  const isAdvancedKeyFormat = typeof templateMonad?.account?.key === "object"

  let priKey
  priKey = isAdvancedKeyFormat ? templateMonad?.account?.key.privateKey : templateMonad?.account?.key

  return {
    ...templateMonad,
    privateKey: priKey,
  }
}
