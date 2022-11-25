import {
  Box,
  Center,
  Container,
  VStack,
  Heading,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  RadioGroup,
  Radio,
  Stack,
  Button,
  Select,
} from "@chakra-ui/react"
import { Formik, FieldArray, Field, useFormik } from "formik"
import { networks } from "./utils/network-tags"

import {
  genNetwork,
  genDependency,
  genDependencyContract,
  genArgumentMessageTranslation,
  genArgumentMessage,
  genArgument,
  genMessageTranslation,
  genMessage,
} from "./utils/form-type-generators.js"

export const Dependencies = ({ values }) => {
  return (
    <Box mt={2} mb={2}>
      <FormLabel htmlFor="dependencies">Template Dependencies</FormLabel>
      <FormHelperText>Dependencies of this template</FormHelperText>

      <FieldArray
        name="dependencies"
        render={(arrayHelpers) =>
          values?.dependencies.length === 0 ? (
            <Button
              key={`dependencies-add`}
              type="button"
              onClick={() => arrayHelpers.insert(0, genDependency())}
            >
              + Insert
            </Button>
          ) : (
            (values?.dependencies).map((dependency, dependencyIndex) => (
              <Box key={`dependencies-${dependencyIndex}`} mt={2} mb={2}>
                <Field
                  key={`dependencies-${dependencyIndex}-input`}
                  name={`dependencies[${dependencyIndex}].placeholder`}
                  type="string"
                  as={Input}
                />
                <Button
                  key={`dependencies-${dependencyIndex}-remove`}
                  type="button"
                  onClick={() => arrayHelpers.remove(dependencyIndex)}
                >
                  - Remove
                </Button>
                <Button
                  key={`dependencies-${dependencyIndex}-add`}
                  type="button"
                  onClick={() =>
                    arrayHelpers.insert(dependencyIndex + 1, genDependency())
                  }
                >
                  + Insert Below
                </Button>

                <Box ml={2} mt={2} mb={2} pl={4} borderLeft={"1px"}>
                  <FormLabel
                    htmlFor={`dependencies-${dependencyIndex}-networks`}
                  >
                    Dependency contracts
                  </FormLabel>
                  <FormHelperText>Contracts for this dependency</FormHelperText>
                  <FieldArray
                    name="dependencies[${dependencyIndex}].contracts"
                    render={(arrayHelpersContract) =>
                      values?.dependencies[dependencyIndex].contracts.length ===
                      0 ? (
                        <Button
                          key={`dependencies-${dependencyIndex}-contracts-add`}
                          type="button"
                          onClick={() =>
                            arrayHelpersContract.insert(
                              0,
                              genDependencyContract()
                            )
                          }
                        >
                          + Insert
                        </Button>
                      ) : (
                        (values?.dependencies[dependencyIndex].contracts).map(
                          (dependencyContract, dependencyContractIndex) => (
                            <Box
                              key={`dependencies-${dependencyIndex}-contracts-${dependencyContractIndex}`}
                              mt={2}
                              mb={2}
                            >
                              <Field
                                key={`dependencies-${dependencyIndex}-contracts-${dependencyContractIndex}.value`}
                                name={`dependencies[${dependencyIndex}].contracts[${dependencyContractIndex}].name`}
                                type="string"
                                as={Input}
                              />

                              <Button
                                key={`dependencies-${dependencyIndex}-contracts-${dependencyContractIndex}-remove`}
                                type="button"
                                onClick={() =>
                                  arrayHelpersContract.remove(
                                    dependencyContractIndex
                                  )
                                }
                              >
                                - Remove
                              </Button>
                              <Button
                                key={`dependencies-${dependencyIndex}-contracts-${dependencyContractIndex}-add`}
                                type="button"
                                onClick={() =>
                                  arrayHelpersContract.insert(
                                    dependencyContractIndex + 1,
                                    genDependencyContract()
                                  )
                                }
                              >
                                + Insert Below
                              </Button>

                              <Box
                                ml={2}
                                mt={2}
                                mb={2}
                                pl={4}
                                borderLeft={"1px"}
                              >
                                <FormLabel
                                  htmlFor={`dependencies-${dependencyIndex}-contracts-${dependencyContractIndex}-networks`}
                                >
                                  Dependency networks
                                </FormLabel>
                                <FormHelperText>
                                  Networks for this dependency
                                </FormHelperText>

                                <FieldArray
                                  name={`dependencies[${dependencyIndex}].contracts[${dependencyContractIndex}].networks`}
                                  render={(arrayHelpersNetworks) =>
                                    values?.dependencies[dependencyIndex]
                                      .contracts[dependencyContractIndex]
                                      .networks.length === 0 ? (
                                      <Button
                                        key={`dependencies-${dependencyIndex}-contracts-${dependencyContractIndex}-add`}
                                        type="button"
                                        onClick={() =>
                                          arrayHelpersNetworks.insert(
                                            0,
                                            genNetwork()
                                          )
                                        }
                                      >
                                        + Insert
                                      </Button>
                                    ) : (
                                      (values?.dependencies[
                                        dependencyIndex
                                      ].contracts[
                                        dependencyContractIndex
                                      ].networks).map(
                                        (
                                          dependencyNetwork,
                                          dependencyNetworkIndex
                                        ) => (
                                          <Box
                                            key={`argumentKeys-${dependencyIndex}-networks-${dependencyNetworkIndex}-`}
                                          >
                                            <Field
                                              key={`dependencies-${dependencyIndex}-contracts-${dependencyContractIndex}-networks-${dependencyNetworkIndex}-address`}
                                              name={`dependencies[${dependencyIndex}].contracts[${dependencyContractIndex}].networks[${dependencyNetworkIndex}].address`}
                                              type="string"
                                              as={Input}
                                            />
                                            <Field
                                              key={`dependencies-${dependencyIndex}-contracts-${dependencyContractIndex}-networks-${dependencyNetworkIndex}-network`}
                                              name={`dependencies[${dependencyIndex}].contracts[${dependencyContractIndex}].networks[${dependencyNetworkIndex}].network`}
                                              type="select"
                                              as={Select}
                                            >
                                              {networks.map((nw) => (
                                                <option>{nw}</option>
                                              ))}
                                            </Field>
                                            <Button
                                              key={`dependencies-${dependencyIndex}-contracts-${dependencyContractIndex}-networks-${dependencyNetworkIndex}-remove`}
                                              type="button"
                                              onClick={() =>
                                                arrayHelpersNetworks.remove(
                                                  dependencyNetworkIndex
                                                )
                                              }
                                            >
                                              - Remove
                                            </Button>
                                            <Button
                                              key={`dependencies-${dependencyIndex}-contracts-${dependencyContractIndex}-networks-${dependencyNetworkIndex}-add`}
                                              type="button"
                                              onClick={() =>
                                                arrayHelpersNetworks.insert(
                                                  dependencyNetworkIndex + 1,
                                                  genNetwork()
                                                )
                                              }
                                            >
                                              + Insert Below
                                            </Button>
                                          </Box>
                                        )
                                      )
                                    )
                                  }
                                />
                              </Box>
                            </Box>
                          )
                        )
                      )
                    }
                  />
                </Box>
              </Box>
            ))
          )
        }
      />
    </Box>
  )
}
