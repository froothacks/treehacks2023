import React from "react";
import {
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
  Link,
} from "@chakra-ui/react";

import { Card, CardHeader, CardBody, CardFooter, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { BaseRoute, QueryParams } from "src/constants/routes";
import { Section } from "src/components/Section";

export const Worksheet = () => {
  const params = useParams();
  const navigate = useNavigate();

  console.log({ ws_id: params[QueryParams.WORKSHEET_ID] });

  return (
    <Section>
      <div className="Worksheet">
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
    </Section>
  );
};
