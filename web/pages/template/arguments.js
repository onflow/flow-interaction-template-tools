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
import {tags} from "./utils/bcp47-tags"

import {
    genNetwork,
    genDependency,
    genArgumentMessageTranslation,
    genArgumentMessage,
    genArgument,
    genMessageTranslation,
    genMessage
} from "./utils/form-type-generators.js"

export const Arguments = ({ values }) => {
    return (
        <Box marginTop="4">
            <FormLabel htmlFor='argumentKeys'>Template Arguments</FormLabel>
            <FormHelperText>Argument Labels for this template</FormHelperText>
            <FieldArray
                name="argumentKeys"
                render={arrayHelpers => 
                    values?.argumentKeys.map((argumentKey, argumentKeyIndex) => (
                        <Box key={`argumentKeys-${argumentKeyIndex}`}>
                            <Field 
                                key={`argumentKeys-${argumentKeyIndex}-input`}
                                name={`argumentKeys[${argumentKeyIndex}].label`}
                                as={Input}
                            />
                            <Button 
                                key={`argumentKeys-${argumentKeyIndex}-remove`}
                                type="button"
                                onClick={() => arrayHelpers.remove(argumentKeyIndex)}
                            >
                                -
                            </Button>
                            <Button
                                key={`argumentKeys-${argumentKeyIndex}-add`}
                                type="button"
                                onClick={() => arrayHelpers.insert(argumentKeyIndex+1, genArgument(""))}
                            >
                                +
                            </Button>

                            <Box marginLeft="4" marginBottom="4">
                                <FormLabel htmlFor={`argumentKeys-${argumentKeyIndex}-type`}>Argument Type</FormLabel>
                                <FormHelperText>Type of this argument</FormHelperText>
                                <Field 
                                    key={`argumentKeys-${argumentKeyIndex}-type`}
                                    name={`argumentKeys[${argumentKeyIndex}].type`}
                                    as={Input}
                                />

                            </Box>

                            <Box marginLeft="0" marginBottom="4">

                                <Box marginLeft="4" marginBottom="4">
                                    <FormLabel htmlFor={`argumentKeys-${argumentKeyIndex}-messages`}>Argument Messages</FormLabel>
                                    <FormHelperText>Messages for this argument</FormHelperText>

                                    <FieldArray
                                        name={`argumentKeys[${argumentKeyIndex}].messages`}
                                        render={arrayHelpersMessages => 
                                            (values?.argumentKeys[argumentKeyIndex].messages).map((argumentKeyMessage, argumentKeyMessageIndex) => (
                                            
                                                <Box marginBottom="4">

                                                    <Field 
                                                        key={`argumentKeys-${argumentKeyIndex}-messages-${argumentKeyMessageIndex}-input`}
                                                        name={`argumentKeys[${argumentKeyIndex}].messages[${argumentKeyMessageIndex}].key`}
                                                        as={Input}
                                                    />
                                                    <Button 
                                                        key={`argumentKeys-${argumentKeyIndex}-messages-${argumentKeyMessageIndex}-remove`}
                                                        type="button"
                                                        onClick={() => arrayHelpersMessages.remove(argumentKeyMessageIndex)}
                                                    >
                                                        -
                                                    </Button>
                                                    <Button
                                                        key={`argumentKeys-${argumentKeyIndex}-messages-${argumentKeyMessageIndex}-add`}
                                                        type="button"
                                                        onClick={() => arrayHelpersMessages.insert(argumentKeyMessageIndex+1, genArgumentMessage("title"))}
                                                    >
                                                        +
                                                    </Button>

                                                    <Box marginLeft="4" marginBottom="4">
                                                        <FormLabel htmlFor={`argumentKeys-${argumentKeyIndex}-messages-${argumentKeyMessageIndex}`}>Argument Message Translations</FormLabel>
                                                        <FormHelperText>Translations for this argument Messsage</FormHelperText>

                                                        <FieldArray
                                                            name={`argumentKeys[${argumentKeyIndex}].messages[${argumentKeyMessageIndex}].translations`}
                                                            render={arrayHelpersTranslations => 

                                                                (values?.argumentKeys[argumentKeyIndex].messages[argumentKeyMessageIndex].translations).map((messageKeyMessageTranslation, messageKeyMessageTranslationIndex) => (
                                                                    <Box key={`argumentKeys-${argumentKeyIndex}-messages-${messageKeyMessageTranslationIndex}-`}>
                                                                        <Field 
                                                                            key={`argumentKeys-${argumentKeyIndex}-messages-${argumentKeyMessageIndex}-translations-${messageKeyMessageTranslationIndex}`}
                                                                            name={`argumentKeys[${argumentKeyIndex}].messages[${argumentKeyMessageIndex}].translations[${messageKeyMessageTranslationIndex}].value`}
                                                                            type='string'
                                                                            as={Input}
                                                                        />
                                                                        <Field 
                                                                            key={`argumentKeys-${argumentKeyIndex}-messages-${argumentKeyMessageIndex}-translations-${messageKeyMessageTranslationIndex}-select`}
                                                                            name={`argumentKeys[${argumentKeyIndex}].messages[${argumentKeyMessageIndex}].translations[${messageKeyMessageTranslationIndex}].name`}
                                                                            type='select'
                                                                            as={Select}
                                                                        >
                                                                            {tags.map(tag => <option>{tag}</option>)}
                                                                        </Field>
                                                                        <Button 
                                                                            key={`argumentKeys-${argumentKeyIndex}-messages-${argumentKeyMessageIndex}-translations-${messageKeyMessageTranslationIndex}-remove`}
                                                                            type="button"
                                                                            onClick={() => arrayHelpersTranslations.remove(messageKeyMessageTranslationIndex)} // remove a friend from the list
                                                                        >
                                                                            -
                                                                        </Button>
                                                                        <Button
                                                                            key={`argumentKeys-${argumentKeyIndex}-messages-${argumentKeyMessageIndex}-translations-${messageKeyMessageTranslationIndex}-add`}
                                                                            type="button"
                                                                            onClick={() => arrayHelpersTranslations.insert(messageKeyMessageTranslationIndex+1, genArgumentMessageTranslation())} // insert an empty string at a position: ;
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
                        </Box>
                    ))
                }
            />
        </Box>
    )
}