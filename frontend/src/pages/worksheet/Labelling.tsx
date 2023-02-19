import React, { useEffect, useState, useRef } from "react";
import { Box, Heading, SkeletonText, Spinner } from "@chakra-ui/react";
import WorksheetLabeller, {
  BoundingBoxType,
} from "src/components/WorksheetLabeller";
import { Id } from "src/convex/_generated/dataModel";

import { useNavigate, useParams } from "react-router-dom";
import { BaseRoute, QueryParams } from "src/constants/routes";
import { useQuery } from "src/convex/_generated/react";
import { Section } from "src/components/Section";
import Lottie from "react-lottie-player";
import animation from "src/static/animation.json";

type WorksheetLabellingProps = {
  startLabelling: () => void;
};
export const WorksheetLabelling: React.FC<WorksheetLabellingProps> = ({
  startLabelling,
}) => {
  const params = useParams();
  const ws_id = params[QueryParams.WORKSHEET_ID] ?? "";
  const worksheet = useQuery(
    "listMessages:getWorksheet",
    new Id("worksheets", ws_id)
  );

  console.log({ worksheet });

  const [boxes, setBoxes] = useState<Array<BoundingBoxType> | null>(null);

  useEffect(() => {
    const getBoundingBoxes = async () => {
      const boundingBoxes = await fetch("http://127.0.0.1:5001/bb", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
          ans_url: worksheet.answer_url,
          blank_url: worksheet.blank_url,
        }),
      });
      const data = await boundingBoxes.json();
      setBoxes(data);
    };
    if (worksheet?.answer_url && worksheet?.blank_url) getBoundingBoxes();
  }, [worksheet]);

  return boxes ? (
    <Box pb={8}>
      <WorksheetLabeller
        boxesInput={boxes}
        ansURL={worksheet.answer_url}
        worksheetId={ws_id}
        startLabelling={startLabelling}
      />
    </Box>
  ) : (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent={"center"}
      alignItems="center"
    >
      <Lottie
        loop
        animationData={animation}
        play
        style={{ width: 600, height: 600 }}
      />
      <Heading as="h2" fontSize={20}>
        Parsing images and loading labels...
      </Heading>
    </Box>
  );
};
