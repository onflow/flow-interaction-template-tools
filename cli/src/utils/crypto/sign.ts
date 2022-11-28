import {ec as EC} from "elliptic"
import {SHA3} from "sha3"
import forge from "node-forge"
import crypto from "node:crypto"
const p256 = new EC("p256")
const secp256 = new EC("secp256k1")

// Takes in a msg that is already in hex form, and a
// hashAlg in flow's key format for hash algorithms
// Return binary digest
export const hashMsgHex = (msgHex: string, hashAlg: string): Buffer => {
  if (hashAlg === "SHA3_256") {
    const sha = new SHA3(256)
    sha.update(Buffer.from(msgHex, "hex"))
    return sha.digest()
    // return crypto.createHash("sha3-256").update(msgHex).digest()
  }

  // if (hashAlg === "SHA2_256") {
  //   const md = forge.md.sha256.create();
  //   md.update(Buffer.from(msgHex, "hex").toString("utf8"), "utf8");
  //   return md.digest()
  //   // return crypto.createHash("sha256").update(msgHex).digest()
  // }

  throw new Error("Unsupported hash alg provided")
}

export const signMessage = async (
  privateKey: string,
  sigAlg: string,
  hashAlg: string,
  msgHex: string,
) => {
  const ec =
    sigAlg === "ECDSA_P256" ?
      p256 :
      (sigAlg === "ECDSA_secp256k1" ?
        secp256 :
        null)
  if (!ec) throw new Error("Unsupported sig alg provided")
  const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"))
  const sig = key.sign(hashMsgHex(msgHex, hashAlg))
  const n = 32
  const r = sig.r.toArrayLike(Buffer, "be", n)
  const s = sig.s.toArrayLike(Buffer, "be", n)
  return Buffer.concat([r, s]).toString("hex")
}

export async function sign(
  privateKey: string,
  signAlgo: string,
  hashAlgo: string,
  msgHex: string,
): Promise<string> {
  return await signMessage(privateKey, signAlgo, hashAlgo, msgHex)
}
