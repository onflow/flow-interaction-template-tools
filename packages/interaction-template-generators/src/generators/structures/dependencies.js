import * as fcl from "@onflow/fcl";
import {
  DEPENDENCY,
  DEPENDENCIES,
  DEPENDENCY_CONTRACT,
  DEPENDENCY_CONTRACT_BY_NETWORK,
} from "../tags.js";

export function dependencyContractByNetwork({
  network,
  contractName,
  address,
  fqAddress,
  pin,
  pinBlockHeight,
}) {
  fcl.invariant(
    typeof network === "string",
    "generateDependencyContractByNetwork({ network }) Error: network must be a string"
  );
  fcl.invariant(
    typeof address === "string",
    "generateDependencyContractByNetwork({ address }) Error: address must be a string"
  );
  fcl.invariant(
    typeof fqAddress === "string",
    "generateDependencyContractByNetwork({ fqAddress }) Error: fqAddress must be a string"
  );
  fcl.invariant(
    typeof pin === "string",
    "generateDependencyContractByNetwork({ pin }) Error: pin must be a string"
  );
  fcl.invariant(
    typeof pinBlockHeight === "number",
    "generateDependencyContractByNetwork({ pinBlockHeight }) Error: pinBlockHeight must be a number"
  );

  return {
    tag: DEPENDENCY_CONTRACT_BY_NETWORK,
    xform: async () => ({
      [network]: {
        address,
        contract: contractName,
        fq_address: fqAddress,
        pin,
        pin_block_height: pinBlockHeight,
      },
    }),
    network,
    address,
    fqAddress,
    pin,
    pinBlockHeight,
  };
}

export function dependencyContract({ contractName, networks = [] }) {
  fcl.invariant(
    typeof contractName === "string",
    "generateDependencyContract({ contractName }) Error: contractName must be a string"
  );

  fcl.invariant(
    Array.isArray(networks),
    "generateDependencyContract({ networks }) Error: networks must be an array"
  );

  for (const network of networks) {
    fcl.invariant(
      typeof network === "object",
      "generateDependencyContract({ networks }) Error: each network must be an object"
    );
    fcl.invariant(
      network.tag === DEPENDENCY_CONTRACT_BY_NETWORK,
      `generateDependencyContract({ networks }) Error: each network must be a ${DEPENDENCY_CONTRACT_BY_NETWORK}`
    );
  }

  return {
    tag: DEPENDENCY_CONTRACT,
    xform: async () => ({
      [contractName]: await networks.reduce(
        async (acc, curr) => ({ ...(await acc), ...(await curr.xform()) }),
        Promise.resolve({})
      ),
    }),
    contractName,
    networks,
  };
}

export function dependency({ addressPlaceholder, contracts = [] }) {
  fcl.invariant(
    typeof addressPlaceholder === "string",
    "generateArgument({ addressPlaceholder }) Error: addressPlaceholder must be a string"
  );

  for (const contract of contracts) {
    fcl.invariant(
      typeof contract === "object",
      "generateDependencies({ contracts }) Error: each contract must be an object"
    );
    fcl.invariant(
      contract.tag === DEPENDENCY_CONTRACT,
      `generateDependencies({ contracts }) Error: each contract must be a ${DEPENDENCY_CONTRACT}`
    );
  }

  return {
    tag: DEPENDENCY,
    xform: async () => ({
      [addressPlaceholder]: await contracts.reduce(
        async (acc, curr) => ({ ...(await acc), ...(await curr.xform()) }),
        Promise.resolve({})
      ),
    }),
    addressPlaceholder,
    contracts,
  };
}

export function dependencies(dependencies = []) {
  fcl.invariant(
    Array.isArray(dependencies),
    "generateDependencies(dependencies) Error: dependencies must be an array"
  );

  for (const dependency of dependencies) {
    fcl.invariant(
      typeof dependency === "object",
      "generateDependencies(dependencies) Error: each dependency must be an object"
    );
    fcl.invariant(
      dependency.tag === DEPENDENCY,
      `generateDependencies(dependencies) Error: each dependency must be a ${DEPENDENCY}`
    );
  }

  return {
    tag: DEPENDENCIES,
    xform: async () =>
      await dependencies.reduce(
        async (acc, curr) => ({ ...(await acc), ...(await curr.xform()) }),
        Promise.resolve({})
      ),
    dependencies,
  };
}
