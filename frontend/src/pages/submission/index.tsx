import React from "react";
import {
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
} from "@chakra-ui/react";

import { Card, CardHeader, CardBody, CardFooter, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { QueryParams } from "src/constants/routes";
import { Section } from "src/components/Section";

export const Submission = () => {
  const params = useParams();

  console.log({ sub_id: params[QueryParams.SUBMISSION_ID] });

  return (
    <Section>
      <div className="Submission ">Submission</div>
    </Section>
  );
};
