import React from "react";
import {
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
} from "@chakra-ui/react";

import { Card, CardHeader, CardBody, CardFooter, Text } from "@chakra-ui/react";
import { Section } from "src/components/Section";

export const Worksheets = () => {
  return (
    <div className="Worksheet">
      <Section>
        <List spacing={6}>
          {Array.from(Array(30).keys()).map((id) => (
            <ListItem>
              <Card>
                <CardBody>
                  <Text>{`Worksheet ${id}`}</Text>
                </CardBody>
              </Card>
            </ListItem>
          ))}
        </List>
      </Section>
    </div>
  );
};
