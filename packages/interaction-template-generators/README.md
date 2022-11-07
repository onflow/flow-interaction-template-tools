# @onflow/interaction-template-generators

## Overview

This package assists developers to programatically create Interaction Template data structures. 

> Interaction Templates are a concept established in FLIP-934. Read the FLIP [here](https://github.com/onflow/flips/blob/main/flips/20220503-interaction-templates.md)

## ⚠️ Status | EARLY DEVELOPMENT

- **Stable:** No
- **Risk of Breaking Change:** High

## Install

```
npm install --save @onflow/interaction-template-generators
```

## Usage

eg:
```javascript
import * as FLIXGenerators from "@onflow/interaction-template-generators"

const InteractionTemplate = await FLIXGenerators.template({
  type: "script",
  iface: "a1b2",
  messages: [
    FLIXGenerators.message({
      tag: "title",
      translations: [
        FLIXGenerators.messageTranslation({
          bcp47tag: "en-US",
          translation: "hello world",
        }),
      ],
    }),
  ],
  cadence:
    "pub fun main(msg: String): String { return 'hello world, ' + msg }",
  dependencies: [
    FLIXGenerators.dependency({
      addressPlaceholder: "0xCONTRACT_A",
      contracts: [
        FLIXGenerators.dependencyContract({
          contractName: "ContractA",
          networks: [
            FLIXGenerators.dependencyContractByNetwork({
              network: "testnet",
              contractName: "ContractA",
              address: "0xABC123DEF456",
              fqAddress: "A.0xABC123DEF456.ContractA",
              pin: "a1",
              pinBlockHeight: 123456,
            }),
          ],
        }),
      ],
    }),
  ],
  args: [
    FLIXGenerators.arg({
      tag: "msg",
      type: "String",
      index: 0,
      messages: [
        FLIXGenerators.message({
          tag: "title",
          translations: [
            FLIXGenerators.messageTranslation({
              bcp47tag: "en-US",
              translation: "A message",
            }),
          ],
        }),
      ],
    }),
  ],
});
```
