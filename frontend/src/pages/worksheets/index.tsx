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
import { Section } from "src/components/Section";
import { useNavigate } from "react-router";
import { BaseRoute } from "src/constants/routes";

export const Worksheets = () => {
  const navigate = useNavigate();

  return (
    <div className="Worksheets">
      <Section>
        <List spacing={6}>
          {Array.from(Array(30).keys()).map((id) => (
            <ListItem>
              <Card>
                <Link onClick={() => navigate(`${BaseRoute.WORKSHEETS}/${id}`)}>
                  <CardBody>
                    <Text>{`Worksheet ${id}`}</Text>
                  </CardBody>
                </Link>
              </Card>
            </ListItem>
          ))}
        </List>
      </Section>
    </div>
  );
};
