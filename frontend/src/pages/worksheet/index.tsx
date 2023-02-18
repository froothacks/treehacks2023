import React from "react";
import {
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
} from "@chakra-ui/react";

import { Card, CardHeader, CardBody, CardFooter, Text } from "@chakra-ui/react";

export const Worksheet = () => {
  return (
    <div className="Worksheet">
      <List spacing={3}>
        {Array.from(Array(30).keys()).map((id) => (
          <ListItem>
            <Card>
              <CardBody>
                <Text>{`Worksheet${id}`}</Text>
              </CardBody>
            </Card>
          </ListItem>
        ))}
      </List>
    </div>
  );
};
