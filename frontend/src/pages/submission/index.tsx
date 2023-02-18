import { Image } from "@chakra-ui/react";

import { Card, CardHeader, CardBody, CardFooter, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { QueryParams } from "src/constants/routes";
import { Section } from "src/components/Section";
import { useQuery } from "src/convex/_generated/react";

export const Submission = () => {
  const params = useParams();
  const messages = useQuery("listMessages") ?? [];

  console.log({ sub_id: params[QueryParams.SUBMISSION_ID] });

  return (
    <Section>
      <div className="Submission ">Submission</div>
      {messages.map((message: any) => (
        <li key={message._id.toString()}>
          <span>{message.author}:</span>
          {message.format === "image" ? (
            <Image src={message.url} height="300px" />
          ) : (
            <span>{message.body}</span>
          )}
          <span>{new Date(message._creationTime).toLocaleTimeString()}</span>
        </li>
      ))}
    </Section>
  );
};
