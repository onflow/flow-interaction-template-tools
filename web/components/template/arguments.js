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
import { tags } from "./utils/bcp47-tags"

import {
  genNetwork,
  genDependency,
  genArgumentMessageTranslation,
  genArgumentMessage,
  genArgument,
  genMessageTranslation,
  genMessage,
} from "./utils/form-type-generators.js"

export const Arguments = ({ values }) => {
  return (
    <Box mt={2} mb={2}>
      <FormLabel htmlFor="argumentKeys">Template Arguments</FormLabel>
      <FormHelperText>Argument Labels for this template</FormHelperText>
      <FieldArray
        name="argumentKeys"
        render={(arrayHelpers) =>
          values?.argumentKeys.length === 0 ? (
            <Button
              key={`argumentKeys-add`}
              type="button"
              onClick={() => arrayHelpers.insert(0, genArgument())}
            >
              + Insert
            </Button>
          ) : (
            values?.argumentKeys.map((argumentKey, argumentKeyIndex) => (
              <Box key={`argumentKeys-${argumentKeyIndex}`} mt={2} mb={2}>
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
                  - Remove
                </Button>
                <Button
                  key={`argumentKeys-${argumentKeyIndex}-add`}
                  type="button"
                  onClick={() =>
                    arrayHelpers.insert(argumentKeyIndex + 1, genArgument(""))
                  }
                >
                  + Insert Below
                </Button>

                <Box ml={2} mt={2} mb={2} borderLeft="1px" pl={4}>
                  <Box mt={2} mb={2}>
                    <FormLabel
                      htmlFor={`argumentKeys-${argumentKeyIndex}-type`}
                    >
                      Argument Type
                    </FormLabel>
                    <FormHelperText>Type of this argument</FormHelperText>
                    <Field
                      key={`argumentKeys-${argumentKeyIndex}-type`}
                      name={`argumentKeys[${argumentKeyIndex}].type`}
                      as={Input}
                    />
                  </Box>

                  <Box mt={2} mb={2}>
                    <Box>
                      <FormLabel
                        htmlFor={`argumentKeys-${argumentKeyIndex}-messages`}
                      >
                        Argument Messages
                      </FormLabel>
                      <FormHelperText>
                        Messages for this argument
                      </FormHelperText>

                      <FieldArray
                        name={`argumentKeys[${argumentKeyIndex}].messages`}
                        render={(arrayHelpersMessages) =>
                          values?.argumentKeys[argumentKeyIndex].messages
                            .length === 0 ? (
                            <Button
                              key={`argumentKeys-${argumentKeyIndex}-add`}
                              type="button"
                              onClick={() =>
                                arrayHelpersMessages.insert(
                                  0,
                                  genArgumentMessage("title")
                                )
                              }
                            >
                              + Insert
                            </Button>
                          ) : (
                            (values?.argumentKeys[
                              argumentKeyIndex
                            ].messages).map(
                              (argumentKeyMessage, argumentKeyMessageIndex) => (
                                <Box marginBottom="4">
                                  <Field
                                    key={`argumentKeys-${argumentKeyIndex}-messages-${argumentKeyMessageIndex}-input`}
                                    name={`argumentKeys[${argumentKeyIndex}].messages[${argumentKeyMessageIndex}].key`}
                                    as={Input}
                                  />
                                  <Button
                                    key={`argumentKeys-${argumentKeyIndex}-messages-${argumentKeyMessageIndex}-remove`}
                                    type="button"
                                    onClick={() =>
                                      arrayHelpersMessages.remove(
                                        argumentKeyMessageIndex
                                      )
                                    }
                                  >
                                    - Remove
                                  </Button>
                                  <Button
                                    key={`argumentKeys-${argumentKeyIndex}-messages-${argumentKeyMessageIndex}-add`}
                                    type="button"
                                    onClick={() =>
                                      arrayHelpersMessages.insert(
                                        argumentKeyMessageIndex + 1,
                                        genArgumentMessage("title")
                                      )
                                    }
                                  >
                                    + Insert Below
                                  </Button>

                                  <Box
                                    ml={2}
                                    mt={2}
                                    mb={2}
                                    borderLeft={"1px"}
                                    paddingLeft={4}
                                  >
                                    <FormLabel
                                      htmlFor={`argumentKeys-${argumentKeyIndex}-messages-${argumentKeyMessageIndex}`}
                                    >
                                      Argument Message Translations
                                    </FormLabel>
                                    <FormHelperText>
                                      Translations for this argument Messsage
                                    </FormHelperText>

                                    <FieldArray
                                      name={`argumentKeys[${argumentKeyIndex}].messages[${argumentKeyMessageIndex}].translations`}
                                      render={(arrayHelpersTranslations) =>
                                        (values?.argumentKeys[argumentKeyIndex]
                                          .messages[argumentKeyMessageIndex]
                                          .translations).length === 0 ? (
                                          <Button
                                            key={`argumentKeys-${argumentKeyIndex}-messages-add`}
                                            type="button"
                                            onClick={() =>
                                              arrayHelpersTranslations.insert(
                                                0,
                                                genArgumentMessageTranslation()
                                              )
                                            }
                                          >
                                            + Insert
                                          </Button>
                                        ) : (
                                          (values?.argumentKeys[
                                            argumentKeyIndex
                                          ].messages[
                                            argumentKeyMessageIndex
                                          ].translations).map(
                                            (
                                              messageKeyMessageTranslation,
                                              messageKeyMessageTranslationIndex
                                            ) => (
                                              <Box
                                                key={`argumentKeys-${argumentKeyIndex}-messages-${messageKeyMessageTranslationIndex}-`}
                                                mt={2}
                                                mb={2}
                                              >
                                                <Field
                                                  key={`argumentKeys-${argumentKeyIndex}-messages-${argumentKeyMessageIndex}-translations-${messageKeyMessageTranslationIndex}`}
                                                  name={`argumentKeys[${argumentKeyIndex}].messages[${argumentKeyMessageIndex}].translations[${messageKeyMessageTranslationIndex}].value`}
                                                  type="string"
                                                  as={Input}
                                                />
                                                <Field
                                                  key={`argumentKeys-${argumentKeyIndex}-messages-${argumentKeyMessageIndex}-translations-${messageKeyMessageTranslationIndex}-select`}
                                                  name={`argumentKeys[${argumentKeyIndex}].messages[${argumentKeyMessageIndex}].translations[${messageKeyMessageTranslationIndex}].name`}
                                                  type="select"
                                                  as={Select}
                                                >
                                                  {tags.map((tag) => (
                                                    <option>{tag}</option>
                                                  ))}
                                                </Field>
                                                <Button
                                                  key={`argumentKeys-${argumentKeyIndex}-messages-${argumentKeyMessageIndex}-translations-${messageKeyMessageTranslationIndex}-remove`}
                                                  type="button"
                                                  onClick={() =>
                                                    arrayHelpersTranslations.remove(
                                                      messageKeyMessageTranslationIndex
                                                    )
                                                  }
                                                >
                                                  - Remove
                                                </Button>
                                                <Button
                                                  key={`argumentKeys-${argumentKeyIndex}-messages-${argumentKeyMessageIndex}-translations-${messageKeyMessageTranslationIndex}-add`}
                                                  type="button"
                                                  onClick={() =>
                                                    arrayHelpersTranslations.insert(
                                                      messageKeyMessageTranslationIndex +
                                                        1,
                                                      genArgumentMessageTranslation()
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
                </Box>
              </Box>
            ))
          )
        }
      />
    </Box>
  )
}
