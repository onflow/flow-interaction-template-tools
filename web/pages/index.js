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
  HStack,
} from "@chakra-ui/react"
import { Formik, FieldArray, Field, useFormik } from "formik"
import { tags } from "../components/template/utils/bcp47-tags"
import { useState, useRef, useEffect } from "react"

import { Messages } from "../components/template/messages"
import { Arguments } from "../components/template/arguments"
import { Dependencies } from "../components/template/dependencies"

import { generateTemplate } from "../components/template/utils/gen-template.js"
import { regenerateTemplateID } from "../components/template/utils/regenerate-template-id.js"

import {
  genNetwork,
  genDependency,
  genArgumentMessageTranslation,
  genArgumentMessage,
  genArgument,
  genMessageTranslation,
  genMessage,
} from "../components/template/utils/form-type-generators.js"

const Template = () => {
  const [generatedTemplate, setGeneratedTemplate] = useState(JSON.stringify({}))
  const [templateText, setTemplateText] = useState(JSON.stringify({}))
  const templateTextAreaRef = useRef(null)

  useEffect(() => {
    if (templateTextAreaRef.current?.value) {
      templateTextAreaRef.current.value = generatedTemplate
    }
  }, [generatedTemplate])

  const regenTemplateID = async () => {
    let newTemplate = await regenerateTemplateID(JSON.parse(templateText))
    setGeneratedTemplate(JSON.stringify(newTemplate, null, 2))
    setTemplateText(JSON.stringify(newTemplate, null, 2))
    alert("Regenerated Interaction Template")
  }

  return (
    <Center bg="gray.200" minHeight="100vh" width="100vw" p="4">
      <Box
        bg="white"
        borderRadius="md"
        width="100%"
        minHeight="100%"
        p="4"
        display="flex"
        alignContent="left"
      >
        <VStack align="stretch" width="100%">
          <Heading as="h2">Interaction Template Generator</Heading>
          <Heading as="h4" size="sm">
            Fill out the form to generate an Interaction Template in JSON form
          </Heading>
          <HStack>
            <VStack align="stretch" width="50%">
              <hr />

              <Box minHeight="100%" width="100%" paddingTop="4">
                <Formik
                  initialValues={{
                    messageKeys: [
                      genMessage("title"),
                      genMessage("description"),
                    ],
                    argumentKeys: [
                      genArgument({ messages: [genArgumentMessage("title")] }),
                    ],
                    templateInterface: "",
                    cadence: "",
                    dependencies: [genDependency()],
                  }}
                  onSubmit={(values) =>
                    setTimeout(async () => {
                      let processedTemplate = await generateTemplate({
                        type: values.type,
                        iface: values.templateInterface,
                        messageKeys: values.messageKeys,
                        cadence: values.cadence,
                        dependencies: values.dependencies,
                        argumentKeys: values.argumentKeys,
                      })
                      setGeneratedTemplate(
                        JSON.stringify(processedTemplate, null, 2)
                      )
                      setTemplateText(
                        JSON.stringify(processedTemplate, null, 2)
                      )
                      alert("New Template Generated")
                    }, 500)
                  }
                  validateOnChange={false}
                  render={({ values, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                      <FormControl>
                        {(() => console.log("values", values))()}

                        <Box>
                          <FormLabel htmlFor="email">Template Type</FormLabel>
                          <FormHelperText>
                            The type of Interaction this template is for.
                          </FormHelperText>
                          <RadioGroup defaultValue="2" mt={2} mb={2}>
                            <Stack spacing={5} direction="row">
                              <Field
                                as={Radio}
                                colorScheme="blue"
                                name="type"
                                value="transaction"
                              >
                                Transaction
                              </Field>
                              <Field
                                as={Radio}
                                colorScheme="blue"
                                name="type"
                                value="script"
                              >
                                Script
                              </Field>
                            </Stack>
                          </RadioGroup>
                        </Box>

                        <hr />

                        <Box marginTop="4">
                          <FormLabel htmlFor="template-interface">
                            (Optional) Template Interface
                          </FormLabel>
                          <FormHelperText>
                            (Optional) The Interface ID this template conforms
                            to.
                          </FormHelperText>
                          <Field
                            name={`templateInterface`}
                            as={Input}
                            mt={2}
                            mb={2}
                          />
                        </Box>

                        <hr />

                        <Box marginTop="4">
                          <FormLabel htmlFor="template-interface">
                            Template Cadence
                          </FormLabel>
                          <FormHelperText>
                            The Cadence for this Template.
                          </FormHelperText>
                          <Field name={`cadence`} as={Textarea} mt={2} mb={2} />
                        </Box>

                        <hr />

                        <Messages values={values} />

                        <hr />

                        <Arguments values={values} />

                        <hr />

                        <Dependencies values={values} />

                        <hr />

                        <Box marginTop="4">
                          <Button color="blue" type="submit">
                            Generate
                          </Button>
                        </Box>
                      </FormControl>
                    </form>
                  )}
                />
              </Box>
            </VStack>

            <Box width="50%" height="100%">
              {templateText !== generatedTemplate && (
                <Box mb="2">
                  <Button color="blue" onClick={regenTemplateID}>
                    Regenerate ID
                  </Button>
                </Box>
              )}
              <Textarea
                width="100%"
                height="100%"
                ref={templateTextAreaRef}
                defaultValue={generatedTemplate}
                onChange={(e) => {
                  setTemplateText(e.target.value)
                }}
              ></Textarea>
            </Box>
          </HStack>
        </VStack>
      </Box>
    </Center>
  )
}

export default Template
