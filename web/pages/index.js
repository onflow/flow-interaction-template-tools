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
} from '@chakra-ui/react'
import {Formik, FieldArray, Field, useFormik} from "formik"
import {tags} from "./template/utils/bcp47-tags"
import {useState} from "react"

import { Messages } from './template/messages'
import { Arguments } from "./template/arguments"
import { Dependencies } from "./template/dependencies"

import {generateTemplate} from "./template/utils/gen-template.js"

import {
  genNetwork,
  genDependency,
  genArgumentMessageTranslation,
  genArgumentMessage,
  genArgument,
  genMessageTranslation,
  genMessage
} from "./template/utils/form-type-generators.js"

const Template = () => {
  const [generatedTemplate, setGeneratedTemplate] = useState(JSON.stringify({}))

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
              <VStack
                  align="stretch"
                  width="100%"
              >  
                  <Heading as="h2">Interaction Template Generator</Heading>
                  <Heading as="h4" size='sm'>Fill out the form to generate an Interaction Template in JSON form</Heading>
                  <HStack>
                      <VStack
                          align="stretch"
                          width="50%"
                      >                    
                          <hr />

                          <Box minHeight="100%" width="100%" paddingTop="4">
                              <Formik
                              initialValues={{ 
                                  messageKeys: [genMessage("title"), genMessage("description")],
                                  argumentKeys: [genArgument({ messages: [genArgumentMessage("title")] })],
                                  templateInterface: "",
                                  cadence: "",
                                  dependencies: [genDependency()]
                              }}
                              onSubmit={values =>
                                  setTimeout(async () => {
                                      // alert(JSON.stringify(values, null, 2));

                                      console.log('values before gen', values)
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
                                  }, 500)
                              }
                              validateOnChange={false}
                              render={({ values, handleSubmit }) => (
                                  <form 
                                      onSubmit={handleSubmit}
                                  >
                                      <FormControl>
                                          {(() => console.log("values", values))()}

                                          <Box>
                                              <FormLabel htmlFor='email'>Template Type</FormLabel>
                                              <RadioGroup defaultValue='2'>
                                                  <Stack spacing={5} direction='row'>
                                                      <Field as={Radio} colorScheme='blue' name="type" value='transaction'>
                                                      Transaction
                                                      </Field>
                                                      <Field as={Radio} colorScheme='blue' name="type" value='script'>
                                                      Script
                                                      </Field>
                                                  </Stack>
                                              </RadioGroup>
                                              <FormHelperText>The type of Interaction this template is for.</FormHelperText>
                                          </Box>

                                          <hr />

                                          <Box marginTop="4">
                                              <FormLabel htmlFor='template-interface'>(Optional) Template Interface</FormLabel>
                                              <Field 
                                                  name={`templateInterface`}
                                                  as={Input}
                                              />
                                              <FormHelperText>(Optional) The Interface ID this template conforms to.</FormHelperText>
                                          </Box>

                                          <hr />
                                          
                                          <Box marginTop="4">
                                              <FormLabel htmlFor='template-interface'>Template Cadence</FormLabel>
                                              <Field 
                                                  name={`cadence`}
                                                  as={Textarea}
                                              />
                                              <FormHelperText>The Cadence for this Template.</FormHelperText>
                                          </Box>

                                          <hr />

                                          <Messages values={values} />

                                          <hr />

                                          <Arguments values={values} />

                                          <hr />

                                          <Dependencies values={values} />

                                          <hr />

                                          <Box 
                                              marginTop="4"
                                          >
                                              <Button color="blue" type="submit">Submit</Button>
                                          </Box>

                                      </FormControl>
                                  </form>
                              )}
                              />
                          </Box>
                      </VStack>

                      <Textarea
                          width="50%"
                          height= "100%"
                          value={generatedTemplate}
                      >
                      </Textarea>
                  </HStack>
              </VStack>
          </Box>
      </Center>
  )
}


export default Template