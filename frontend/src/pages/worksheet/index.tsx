import React, { useRef, useState } from "react";
import {
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
  Link,
  useDisclosure,
  Button,
  Box,
} from "@chakra-ui/react";

import { Card, CardHeader, CardBody, CardFooter, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { BaseRoute, QueryParams } from "src/constants/routes";
import { Section } from "src/components/Section";
import WorksheetLabeller from "src/components/WorksheetLabeller";
import { useQuery } from "src/convex/_generated/react";
import { Id } from "src/convex/_generated/dataModel";

export const Worksheet = () => {
  const params = useParams();
  const navigate = useNavigate();
  const ws_id = params[QueryParams.WORKSHEET_ID];
  const worksheet = useQuery(
    "listMessages:getWorksheet",
    new Id("worksheets", ws_id ?? "")
  );

  console.log({ worksheet });

  const [didUpdateBoundingBoxes, setUpdateBoundingBoxes] = useState(false);

  // TODO: Pull for boolean field didUpdateBB

  return (
    <Section>
      {worksheet && <Text>ID: {worksheet._id.id}</Text>}
      <Button onClick={() => setUpdateBoundingBoxes((prev) => !prev)}>
        Toggle boolean
      </Button>
      <div className="Worksheet">
        {didUpdateBoundingBoxes ? (
          <div>
            <Button onClick={() => {}}>Add submission</Button>
            <List spacing={3}>
              {Array.from(Array(30).keys()).map((id) => (
                <ListItem>
                  <Card>
                    <Link
                      onClick={() => navigate(`${BaseRoute.SUBMISSIONS}/${id}`)}
                    >
                      <CardBody>
                        <Text>{`Submission ${id}`}</Text>
                      </CardBody>
                    </Link>
                  </Card>
                </ListItem>
              ))}
            </List>
          </div>
        ) : (
          <Box pb={8}>
            <WorksheetLabeller />
          </Box>
        )}
      </div>
    </Section>
  );
};
