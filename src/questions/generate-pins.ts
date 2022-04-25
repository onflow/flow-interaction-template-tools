import inquirer from "inquirer"
import {File} from "../utils/read-files"
import * as fcl from "@onflow/fcl"
import {logger} from "../utils/logger"
import crypto from "crypto"

async function inputAddressForNetwork(file: File, address: string, network: string): Promise<string> {
    return inquirer.prompt([
        {
            type: 'input',
            message: `[${file?.path}] Input account address for ${address} on ${network}:`,
            name: 'address',
            validate(answer) { 
                if (fcl.sansPrefix(answer).length !== 16) {
                    return "Account address must be 16 characters long"
                }
                return true;
            },
        }
    ]).then(answers => {
        return fcl.withPrefix(answers.address)
    })
}

function findImports(cadence: string, isPlaceholder: boolean = false): iport[] {
    let iports: iport[] = []

    let importsReg = /import \w+ from 0x\w+/g
    let fileImports = cadence.match(importsReg) || []
    for (const fileImport of fileImports) {
        let importReg = /import (\w+) from (0x\w+)/g
        let fileiport = importReg.exec(fileImport)
        if (fileiport) {
            if (isPlaceholder) {
                iports.push({
                    addressPlaceholder: fileiport[2],
                    contractName: fileiport[1],
                })
            } else {
                iports.push({
                    address: fileiport[2],
                    contractName: fileiport[1],
                })
            }
        }
    }

    return iports
} 

interface iport {
    addressPlaceholder?: string,
    address?: string,
    contractName: string,
    contract?: string
}

interface iAddressMemo {
    [network: string]: any,
}

interface iPins {
    [network: string]: any
}

export async function generatePins(file: File, flowJSON: any): Promise<iPins> {
    let addressMemo: iAddressMemo = {
        testnet: {},
        mainnet: {},
        emulator: {},
    }

    let pins: iPins = {
        testnet: null,
        mainnet: null,
        emulator: null,
    }

    let iports: iport[] = findImports(file?.content, true)

    let networks = ["testnet", "mainnet", "emulator"]

    for (const network of networks) {
        let doesUserWantToGeneratePin: boolean = true
        await inquirer.prompt([
            {
                type: 'confirm',
                message: `[${file?.path}] Do you want to generate a dependency pin for ${network}? :`,
                name: 'toGeneratePin',
                default: true,
                validate(answer) {    
                    return true;
                },
            }
        ]).then(answers => {
            doesUserWantToGeneratePin = answers.toGeneratePin
        })
        if (!doesUserWantToGeneratePin) continue

        logger.default(`🌱 Generating dependency pin for ${network}...`)

        for (const iport of iports) {
            if (!(addressMemo?.[network]?.[iport?.addressPlaceholder!])) {
                const addr = await inputAddressForNetwork(file, iport?.addressPlaceholder!, network)
                addressMemo[network][iport?.addressPlaceholder!] = addr
            }
            iport.address = addressMemo[network][iport?.addressPlaceholder!]
        }

        const accessNodeAPI = flowJSON?.networks?.[network]
        await fcl.config().put("accessNode.api", accessNodeAPI)

        let latestSealedBlock = await fcl.block({ sealed: true })
        let latestBlockPin = latestSealedBlock?.height

        for (const iport of iports) {
            let account = await fcl.send([
                fcl.getAccount(iport.address!),
                fcl.atBlockHeight(latestBlockPin)
            ]).then(fcl.decode)

            iport.contract = account.contracts?.[iport.contractName]

            let contractIports: iport[] = findImports(iport.contract!, false)

            iports.push(...contractIports)
        }

        let contractHashes = iports.map(iport => {
            return crypto.createHash("sha256").update(iport.contract!).digest("hex")
        })
        let contractHashesJoined = contractHashes.join("") 
        
        pins[network] = {
            pin: crypto.createHash("sha256").update(contractHashesJoined).digest("hex"),
            pin_block_height: latestBlockPin
        }
    }

    return pins
}