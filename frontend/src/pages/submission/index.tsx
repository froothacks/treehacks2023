import { Image } from "@chakra-ui/react";

import { Card, CardHeader, CardBody, CardFooter, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { QueryParams } from "src/constants/routes";
import { Section } from "src/components/Section";
import { useQuery } from "src/convex/_generated/react";
import { Id } from "src/convex/_generated/dataModel";

export const Submission = () => {
  const params = useParams();

  const sub_id = params[QueryParams.SUBMISSION_ID];
  const submission = useQuery(
    "listMessages:getSubmission",
    new Id("submissions", sub_id ?? "")
  );

  return (
    <Section>
      <div className="Submission ">Submission</div>
      {submission && <Text>ID: {submission._id.id}</Text>}
    </Section>
  );
};
