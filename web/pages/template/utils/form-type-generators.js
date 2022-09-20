export const genNetwork = (network = "mainnet", address = "", name = "") => ({
  network,
  address,
});

export const genDependencyContract = () => ({
  name: "",
  networks: [genNetwork()],
});

export const genDependency = (placeholder = "") => ({
  placeholder,
  contracts: [genDependencyContract()],
});

export const genArgumentMessageTranslation = (tag = "en-US") => ({
  tag,
  value: "",
});

export const genArgumentMessage = (key = "") => ({
  key,
  translations: [genArgumentMessageTranslation()],
});

export const genArgument = ({
  label = "",
  type = "",
  messages = [genArgumentMessage("title")],
}) => ({
  label,
  type,
  messages,
});

export const genMessageTranslation = (tag = "en-US") => ({
  tag,
  value: "",
});

export const genMessage = (key = "") => ({
  key,
  translations: [genMessageTranslation()],
});
