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
} from "@chakra-ui/react";
import { Formik, FieldArray, Field, useFormik } from "formik";
import { tags } from "./utils/bcp47-tags";

import {
  genNetwork,
  genDependency,
  genArgumentMessageTranslation,
  genArgumentMessage,
  genArgument,
  genMessageTranslation,
  genMessage,
} from "./utils/form-type-generators.js";

export const Messages = ({ values }) => {
  return (
    <Box marginTop="4">
      <FormLabel htmlFor="messageKeys">Template Messages</FormLabel>
      <FormHelperText>Messages for this template</FormHelperText>
      <FieldArray
        name="messageKeys"
        render={(arrayHelpers) =>
          values?.dependencies.length === 0 ? (
            <Button
              key={`dependencies-add`}
              type="button"
              onClick={() => arrayHelpers.insert(0, genMessage())}
            >
              + Insert
            </Button>
          ) : (
            values?.messageKeys.map((messageKey, messageKeyIndex) => (
              <Box key={`messageKey-${messageKeyIndex}`}>
                <Field
                  key={`messageKeys-${messageKeyIndex}-input`}
                  name={`messageKeys[${messageKeyIndex}].key`}
                  as={Input}
                />
                <Button
                  key={`messageKeys-${messageKeyIndex}-remove`}
                  type="button"
                  onClick={() => arrayHelpers.remove(messageKeyIndex)}
                >
                  - Remove
                </Button>
                <Button
                  key={`messageKeys-${messageKeyIndex}-add`}
                  type="button"
                  onClick={() =>
                    arrayHelpers.insert(messageKeyIndex + 1, genMessage(""))
                  }
                >
                  + Insert Below
                </Button>

                <Box marginLeft="4" marginBottom="4">
                  <FormLabel
                    htmlFor={`messageKeys-${messageKeyIndex}-translations`}
                  >
                    Message Translations
                  </FormLabel>
                  <FormHelperText>A BCP-47 langauge tag</FormHelperText>
                  <FieldArray
                    name={`messageKeys[${messageKeyIndex}].translations`}
                    render={(arrayHelpersTranslations) =>
                      (values?.messageKeys[messageKeyIndex].translations).map(
                        (
                          messageKeyTranslationTag,
                          messageKeyTranslationTagIndex
                        ) => (
                          <Box
                            key={`messageKeys-${messageKeyIndex}-translations-${messageKeyTranslationTagIndex}`}
                          >
                            <Field
                              key={`messageKeys-${messageKeyIndex}-translations-${messageKeyTranslationTagIndex}-input`}
                              name={`messageKeys[${messageKeyIndex}].translations[${messageKeyTranslationTagIndex}].value`}
                              type="string"
                              as={Input}
                            />
                            <Field
                              key={`messageKeys-${messageKeyIndex}-translations-${messageKeyTranslationTagIndex}-select`}
                              name={`messageKeys[${messageKeyIndex}].translations[${messageKeyTranslationTagIndex}].tag`}
                              type="select"
                              as={Select}
                            >
                              {tags.map((tag) => (
                                <option>{tag}</option>
                              ))}
                            </Field>
                            <Button
                              key={`messageKeys-${messageKeyIndex}-translations-${messageKeyTranslationTagIndex}-remove`}
                              type="button"
                              onClick={() =>
                                arrayHelpersTranslations.remove(
                                  messageKeyTranslationTagIndex
                                )
                              }
                            >
                              - Remove
                            </Button>
                            <Button
                              key={`messageKeys-${messageKeyIndex}-translations-${messageKeyTranslationTagIndex}-add`}
                              type="button"
                              onClick={() =>
                                arrayHelpersTranslations.insert(
                                  messageKeyTranslationTagIndex + 1,
                                  genMessageTranslation()
                                )
                              }
                            >
                              + Insert Below
                            </Button>
                          </Box>
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
  );
};
