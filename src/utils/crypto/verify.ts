import { ec as EC } from "elliptic";
import { SHA3 } from "sha3";
import forge from "node-forge";
import crypto from "crypto";

const p256 = new EC("p256");
const secp256 = new EC("secp256k1");

// Takes in a msg that is already in hex form, and a
// hashAlg in flow's key format for hash algorithms
// Return binary digest
const hashMsgHex = (msgHex: string, hashAlg: string): Buffer => {
    if (hashAlg === "SHA3_256") {
        // const sha = new SHA3(256);
        // sha.update(Buffer.from(msgHex, "hex"));
        // return sha.digest()
        return crypto.createHash("sha3-256").update(msgHex).digest()
    } else if (hashAlg === "SHA2_256") {
        // const md = forge.md.sha256.create();
        // md.update(Buffer.from(msgHex, "hex").toString("utf8"), "utf8");
        // return md.digest()
        return crypto.createHash("sha256").update(msgHex).digest()
    } else {
        throw new Error("Unsupported hash alg provided");
    }
}

export const verifyMessage = async (publicKey: string, signature: string, sigAlg: string, hashAlg: string, msgHex: string) => {
  const ec = sigAlg === "ECDSA_P256" ? p256 : (sigAlg === "ECDSA_secp256k1" ? secp256 : null);
  console.log("msgHex", msgHex, "hashAlg", hashAlg, "sigAlg", sigAlg, "signature", signature)

  if (!ec) throw new Error("Unsupported sig alg provided");
  const key = ec.keyFromPublic(Buffer.from(publicKey, "hex"), "hex");

  console.log("msgHex", msgHex, "hashAlg", hashAlg, "signature", signature)

  const verified = key.verify(hashMsgHex(msgHex, hashAlg), signature);
//   const n = 32;
//   const r = sig.r.toArrayLike(Buffer, "be", n);
//   const s = sig.s.toArrayLike(Buffer, "be", n);
  return verified
}

export async function verify(publicKey: string, signature: string, signAlgo: string, hashAlgo: string, data: string): Promise<boolean> {
    // const toVerifyHex = Buffer.from(data, "utf8").toString("hex")
    return await verifyMessage(publicKey, signature, signAlgo, hashAlgo, data)
}
