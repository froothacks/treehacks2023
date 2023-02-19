import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
  Link,
  Box,
  Spinner,
} from "@chakra-ui/react";
import {useQuery} from "src/convex/_generated/react";

import { Card, CardHeader, CardBody, CardFooter, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { BaseRoute, QueryParams } from "src/constants/routes";
import { Section } from "src/components/Section";
import WorksheetLabeller, { BoundingBoxType } from "src/components/WorksheetLabeller";

export const Worksheet = () => {
  const params = useParams();
  const navigate = useNavigate();

  console.log({ ws_id: params[QueryParams.WORKSHEET_ID] });
  const ws_id = params[QueryParams.WORKSHEET_ID]
  const getWorksheetURLs = useQuery("listMessages:getWorksheetURLs")
  const [boxes, setBoxes] = useState<Array<BoundingBoxType> | null>(null)

  useEffect(() => {
    const getBoundingBoxes = async () => {
      const {answerURL, blankURL} = await getWorksheetURLs(ws_id)
      const boundingBoxes = await fetch("http://127.0.0.1:5000/bb", {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
                ans_url: answerURL,
                blank_url: blankURL,
            })
        })
        const data = await boundingBoxes.json()
        setBoxes(data)
    }
    getBoundingBoxes()
  }, [])

  return (
    <Section>
      <div className="Worksheet">
        {boxes ? <Box pb={8}>
          <WorksheetLabeller boxesInput={boxes}/>
        </Box> : <Spinner />}
        

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
