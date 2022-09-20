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
} from "@chakra-ui/react";
import { Formik, FieldArray, Field, useFormik } from "formik";
import { tags } from "./utils/bcp47-tags";
import { useState, useRef, useEffect } from "react";

import { Messages } from "./messages";
import { Arguments } from "./arguments";
import { Dependencies } from "./dependencies";

import { generateTemplate } from "./utils/gen-template.js";
import { regenerateTemplateID } from "./utils/regenerate-template-id";

import {
  genNetwork,
  genDependency,
  genArgumentMessageTranslation,
  genArgumentMessage,
  genArgument,
  genMessageTranslation,
  genMessage,
} from "./utils/form-type-generators.js";

const Template = () => {
  return null;
};

export default Template;
