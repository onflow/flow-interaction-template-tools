import * as fcl from "@onflow/fcl";

const template = `{
    "f_type": "InteractionTemplate",
    "f_version": "1.0.0",
    "id": "",
    "data": {
      "type": "",
      "interface": "",
      "messages": {},
      "cadence": "",
      "dependencies": {},
      "arguments": {}
    }   
}`;

const genTemplate = () => JSON.parse(template);

export async function generateTemplate({
  type,
  iface,
  messageKeys,
  cadence,
  dependencies,
  argumentKeys,
}) {
  let messages = {};
  messageKeys.forEach((msgKey) => {
    let translations = {};
    msgKey.translations.forEach((msgKeyTranslation) => {
      translations[msgKeyTranslation.tag] = msgKeyTranslation.value;
    });

    messages[msgKey.key] = { i18n: translations };
  });

  let args = {};
  argumentKeys.forEach((argKey, argKeyIndex) => {
    let messages = {};
    argKey.messages.forEach((argKeyMessage) => {
      let translations = {};
      argKeyMessage.translations.map((argKeyMessageTranslation) => {
        translations[argKeyMessageTranslation.tag] =
          argKeyMessageTranslation.value;
      });

      messages[argKeyMessage.key] = {
        i18n: translations,
      };
    });

    args[argKey.label] = {
      index: argKeyIndex,
      type: argKey.type,
      messages: messages,
      balance: "",
    };
  });

  let accessNodes = {
    mainnet: "https://rest-mainnet.onflow.org",
    testnet: "https://rest-testnet.onflow.org",
    emulator: "http://localhost:8888",
  };

  let deps = {};
  let depPromises = dependencies.map(async (dep, depIndex) => {
    let depContractPromises = dep.contracts.map(async (depContract) => {
      let networks = {};
      let depContractNetworksPromises = depContract.networks.map(
        async (depNetwork) => {
          let latestSealedBlock = await fcl.block(
            { sealed: true },
            { node: accessNodes[depNetwork.network] }
          );
          let latestBlockHeight = latestSealedBlock?.height;

          const pin = await fcl.InteractionTemplateUtils.generateDependencyPin(
            {
              address: depNetwork.address,
              contractName: depContract.name,
              blockHeight: latestBlockHeight,
            },
            { node: accessNodes[depNetwork.network] }
          );

          networks[depNetwork.network] = {
            address: depNetwork.address,
            fq_address: `A.${depNetwork.address}.${depContract.name}`,
            contract: depContract.name,
            pin,
            pin_block_height: latestBlockHeight,
          };
        }
      );

      for (let depContractNetworkPromise of depContractNetworksPromises)
        await depContractNetworkPromise;

      deps[dep.placeholder] = {
        [depContract.name]: networks,
      };
    });

    for (let depContractPromise of depContractPromises)
      await depContractPromise;
  });

  for (let depPromise of depPromises) await depPromise;

  let template = genTemplate();
  template.data.type = type;
  template.data.interface = iface;
  // template.author = author
  // template.data.version = version
  template.data.messages = messages;
  template.data.cadence = cadence;
  template.data.dependencies = deps;
  template.data.arguments = args;

  console.log("pre template id gen", template);

  template.id = await fcl.InteractionTemplateUtils.generateTemplateId({
    template,
  });

  console.log("post template id gen", template);

  return template;
}
