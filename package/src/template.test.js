import * as FLIX from "./interaction-template-utils.js";

describe("template", () => {
  test("makes a valid interaction template", async () => {
    const template = await FLIX.generateTemplate({
      type: FLIX.generateType("script"),
      iface: FLIX.generateInterface("a1b2"),
      messages: FLIX.generateMessages([
        FLIX.generateMessage({
          tag: "title",
          translations: [
            FLIX.generateMessageTranslation({
              bcp47tag: "en-US",
              translation: "hello world",
            }),
          ],
        }),
      ]),
      cadence: FLIX.generateCadence(
        "pub fun main(msg: String): String { return 'hello world, ' + msg }"
      ),
      dependencies: FLIX.generateDependencies([
        FLIX.generateDependency({
          addressPlaceholder: "0xCONTRACT_A",
          contracts: [
            FLIX.generateDependencyContract({
              contractName: "ContractA",
              networks: [
                FLIX.generateDependencyContractByNetwork({
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
      ]),
      args: FLIX.generateArguments([
        FLIX.generateArgument({
          tag: "msg",
          type: "String",
          index: 0,
          messages: [
            FLIX.generateMessage({
              tag: "title",
              translations: [
                FLIX.generateMessageTranslation({
                  bcp47tag: "en-US",
                  translation: "A message",
                }),
              ],
            }),
          ],
        }),
      ]),
    });

    expect(template).toStrictEqual(
      JSON.parse(
        `{"f_type":"InteractionTemplate","f_version":"1.0.0","id":"95df33ba3cb1cca9ec1b3ac224ecc6573cf4e124159d4655b7e0801c595a663d","data":{"type":"script","interface":"a1b2","messages":{"title":{"i18n":{"en-US":"hello world"}}},"cadence":"pub fun main(msg: String): String { return 'hello world, ' + msg }","dependencies":{"0xCONTRACT_A":{"ContractA":{"testnet":{"address":"0xABC123DEF456","contract":"ContractA","fq_address":"A.0xABC123DEF456.ContractA","pin":"a1","pin_block_height":123456}}}},"arguments":{"msg":{"index":0,"type":"String","messages":{"title":{"i18n":{"en-US":"A message"}}}}}}}`
      )
    );
  });
});
