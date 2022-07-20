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
} from '@chakra-ui/react'
import {Formik, FieldArray, Field, useFormik} from "formik"
import {networks} from "./utils/network-tags"

import {
    genNetwork,
    genDependency,
    genDependencyContract,
    genArgumentMessageTranslation,
    genArgumentMessage,
    genArgument,
    genMessageTranslation,
    genMessage
} from "./utils/form-type-generators.js"

export const Dependencies = ({ values }) => {
    return (
        <Box marginTop="4">
            <FormLabel htmlFor='dependencies'>Template Dependencies</FormLabel>
            <FormHelperText>Dependencies of this template</FormHelperText>

            <FieldArray
                name="dependencies"
                render={arrayHelpers => 
                    (values?.dependencies).map((dependency, dependencyIndex) => (
                        <Box key={`dependencies-${dependencyIndex}`}>
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
                                -
                            </Button>
                            <Button
                                key={`dependencies-${dependencyIndex}-add`}
                                type="button"
                                onClick={() => arrayHelpers.insert(dependencyIndex+1, genDependency())}
                            >
                                +
                            </Button>

                            <Box marginLeft="4" marginBottom="4">
                                <FormLabel htmlFor={`dependencies-${dependencyIndex}-networks`}>Dependency contracts</FormLabel>
                                <FormHelperText>Contracts for this dependency</FormHelperText>
                                <FieldArray
                                    name="dependencies[${dependencyIndex}].contracts"
                                    render={arrayHelpersContract => 
                                        (values?.dependencies).map((dependency, dependencyContractIndex) => (
                                            <Box key={`dependencies-${dependencyIndex}-contracts`}>

                                                <Field 
                                                    key={`dependencies-${dependencyIndex}-contracts-${dependencyContractIndex}.value`}
                                                    name={`dependencies[${dependencyIndex}].contracts[${dependencyContractIndex}].name`}
                                                    type="string"
                                                    as={Input}
                                                />

                                                <Button 
                                                    key={`dependencies-${dependencyIndex}-contracts-${dependencyContractIndex}-remove`}
                                                    type="button"
                                                    onClick={() => arrayHelpersContract.remove(dependencyContractIndex)}
                                                >
                                                    -
                                                </Button>
                                                <Button
                                                    key={`dependencies-${dependencyIndex}-contracts-${dependencyContractIndex}-add`}
                                                    type="button"
                                                    onClick={() => arrayHelpersContract.insert(dependencyContractIndex+1, genDependencyContract())}
                                                >
                                                    +
                                                </Button>

                                                <Box marginLeft="4" marginBottom="4">
                                                    <FormLabel htmlFor={`dependencies-${dependencyIndex}-contracts-${dependencyContractIndex}-networks`}>Dependency networks</FormLabel>
                                                    <FormHelperText>Networks for this dependency</FormHelperText>

                                                    <FieldArray
                                                        name={`dependencies[${dependencyIndex}].contracts[${dependencyContractIndex}].networks`}
                                                        render={arrayHelpersNetworks => 
                                                            (values?.dependencies[dependencyIndex].contracts[dependencyContractIndex].networks).map((dependencyNetwork, dependencyNetworkIndex) => (
                                                                <Box key={`argumentKeys-${dependencyIndex}-networks-${dependencyNetworkIndex}-`}>
                                                                    <Field 
                                                                        key={`dependencies-${dependencyIndex}-contracts-${dependencyContractIndex}-networks-${dependencyNetworkIndex}-address`}
                                                                        name={`dependencies[${dependencyIndex}].contracts[${dependencyContractIndex}].networks[${dependencyNetworkIndex}].address`}
                                                                        type='string'
                                                                        as={Input}
                                                                    />
                                                                    <Field 
                                                                        key={`dependencies-${dependencyIndex}-contracts-${dependencyContractIndex}-networks-${dependencyNetworkIndex}-network`}
                                                                        name={`dependencies[${dependencyIndex}].contracts[${dependencyContractIndex}].networks[${dependencyNetworkIndex}].network`}
                                                                        type='select'
                                                                        as={Select}
                                                                    >
                                                                        {networks.map(nw => <option>{ nw }</option>)}
                                                                    </Field>
                                                                    <Button 
                                                                        key={`dependencies-${dependencyIndex}-contracts-${dependencyContractIndex}-networks-${dependencyNetworkIndex}-remove`}
                                                                        type="button"
                                                                        onClick={() => arrayHelpersNetworks.remove(dependencyNetworkIndex)}
                                                                    >
                                                                        -
                                                                    </Button>
                                                                    <Button
                                                                        key={`dependencies-${dependencyIndex}-contracts-${dependencyContractIndex}-networks-${dependencyNetworkIndex}-add`}
                                                                        type="button"
                                                                        onClick={() => arrayHelpersNetworks.insert(dependencyNetworkIndex+1, genNetwork())}
                                                                    >
                                                                        +
                                                                    </Button>
                                                                </Box>
                                                            ))
                                                        }
                                                    />
                                                </Box>

                                            </Box>
                                        ))
                                    }
                                />
                            </Box>

                        </Box>
                    ))
                }
            />

        </Box>
    )
}