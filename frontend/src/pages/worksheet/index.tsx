import React, { useEffect, useState, useRef } from "react";
import { Id } from "src/convex/_generated/dataModel";

import { useNavigate, useParams } from "react-router-dom";
import { BaseRoute, QueryParams } from "src/constants/routes";
import { useMutation, useQuery } from "src/convex/_generated/react";
import { WorksheetSubmissions } from "./Submissions";
import { WorksheetLabelling } from "./Labelling";
import { Section } from "src/components/Section";
import { Box, Button, Heading, Text } from "@chakra-ui/react";

import { useInterval } from "usehooks-ts";
import Lottie from "react-lottie-player";

import animation from "src/static/animation.json";

export const Worksheet = () => {
  const params = useParams();
  const ws_id = params[QueryParams.WORKSHEET_ID] ?? "";
  const worksheet = useQuery(
    "listMessages:getWorksheet",
    new Id("worksheets", ws_id)
  );
  const [finishedLabelling, setFinishLabelling] = useState(false);
  const [startLabelling, setStartLabelling] = useState(false);

  console.log({ startLabelling, finishedLabelling });
  useInterval(() => {
    if (worksheet && worksheet.labelling_done) {
      setFinishLabelling(true);
      console.log({ worksheet });
    }
  }, 1000);

  if (startLabelling && !finishedLabelling) {
    return (
      <Box display="flex" flexDirection="column" justifyContent={"center"} alignItems="center">
        <Lottie
          loop
          animationData={animation}
          play
          style={{ width: 600, height: 600 }}
        />
       <Heading as="h2" fontSize={20}>Computing eigenvalues and calculating grades...</Heading>
      </Box>
    );
  }

  return (
    <div>
      {finishedLabelling ? (
        <WorksheetSubmissions />
      ) : (
        <WorksheetLabelling startLabelling={() => setStartLabelling(true)} />
      )}
    </div>
  );
};
