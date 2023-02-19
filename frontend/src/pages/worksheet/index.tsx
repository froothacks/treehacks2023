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

export const Worksheet = () => {
  const params = useParams();
  const navigate = useNavigate();

  console.log({ ws_id: params[QueryParams.WORKSHEET_ID] });

  const [didUpdateBoundingBoxes, setUpdateBoundingBoxes] = useState(false);

  // TODO: Pull for boolean field didUpdateBB

  return (
    <Section>
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
