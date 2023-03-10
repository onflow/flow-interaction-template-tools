import * as fcl from "@onflow/fcl"
import catalogJson from "./catalog_c2j.json"

export async function getGeneratedTransaction(tx: string, collectionIdentifer: string, vaultIdentifier: string, merchantAddress: string): Promise<any> {
  try {
    const scriptResult = await fcl.send([
      fcl.script(catalogJson.scripts.gen_tx),
      fcl.args([
        fcl.arg(tx, fcl.t.String),
        fcl.arg(collectionIdentifer, fcl.t.String),
        fcl.arg(vaultIdentifier, fcl.t.String),
        fcl.arg(merchantAddress, fcl.t.String)
      ])
    ]).then(fcl.decode)
    return scriptResult
  } catch (e) {
    return null
  }
}

export async function getAllCollections(): Promise<any> {
  const CHUNK = 50
  const collectionCount = await getCollectionsCount();
  const catalogBatches: [string, string][] = []
  for (let i = 0; i < collectionCount; i += CHUNK) {
    if (i + CHUNK > collectionCount) {
      catalogBatches.push([String(i), String(collectionCount)])
    } else {
      catalogBatches.push([String(i), String(i + CHUNK)])
    }
  }
  let collections: any = {};
  for (const catalogBatch of catalogBatches) {
    const currentBatch = await getCollections(catalogBatch) || []
    collections = {
      ...currentBatch,
      ...collections
    }

  }
  return collections;
}

export async function getCollections(batch: [string, string] | null): Promise<any> {
  try {
    const scriptResult = await fcl.send([
      fcl.script(catalogJson.scripts.get_nft_catalog),
      fcl.args([
        fcl.arg(batch, fcl.t.Optional(fcl.t.Array(fcl.t.UInt64)))
      ])
    ]).then(fcl.decode)
    return scriptResult
  } catch (e) {
    console.error(e)
    return null;
  }
}

export async function getCollectionsCount(): Promise<any> {
  try {
    const scriptResult = await fcl.send([
      fcl.script(catalogJson.scripts.get_nft_catalog_count),
      fcl.args([
      ])
    ]).then(fcl.decode)
    return scriptResult
  } catch (e) {
    console.error(e)
    return null;
  }
}

export async function getSupportedGeneratedTransactions(): Promise<any> {
  try {
    const scriptResult = await fcl.send([
      fcl.script(catalogJson.scripts.get_supported_generated_transactions),
      fcl.args([])
    ]).then(fcl.decode)
    return scriptResult
  } catch (e) {
    console.error(e)
    return null
  }
}
