import React, { useEffect, useState, useRef } from "react";
import { Box, Spinner } from "@chakra-ui/react";
import WorksheetLabeller, {
  BoundingBoxType,
} from "src/components/WorksheetLabeller";
import { Id } from "src/convex/_generated/dataModel";

import { useNavigate, useParams } from "react-router-dom";
import { BaseRoute, QueryParams } from "src/constants/routes";
import { useQuery } from "src/convex/_generated/react";

export const WorksheetLabelling = () => {
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
      const boundingBoxes = await fetch("http://127.0.0.1:5000/bb", {
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
      />
    </Box>
  ) : (
    <Spinner />
  );
};
