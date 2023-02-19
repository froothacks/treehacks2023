import React, { useEffect, useState, useRef } from "react";
import { Id } from "src/convex/_generated/dataModel";

import { useNavigate, useParams } from "react-router-dom";
import { BaseRoute, QueryParams } from "src/constants/routes";
import { useMutation, useQuery } from "src/convex/_generated/react";
import { WorksheetSubmissions } from "./Submissions";
import { WorksheetLabelling } from "./Labelling";
import { Section } from "src/components/Section";
import { Button } from "@chakra-ui/react";

import { useInterval } from "usehooks-ts";

export const Worksheet = () => {
  const params = useParams();
  const ws_id = params[QueryParams.WORKSHEET_ID] ?? "";
  const worksheet = useQuery(
    "listMessages:getWorksheet",
    new Id("worksheets", ws_id)
  );
  const [didUpdateBoundingBoxes, setUpdateBoundingBoxes] = useState(false);
  const [startLabelling, setStartLabelling] = useState(false);

  useInterval(() => {
    if (worksheet && worksheet.labelling_done) {
      setUpdateBoundingBoxes(true);
      console.log({ worksheet });
    }
  }, 1000);

  return (
    <div>
      {didUpdateBoundingBoxes ? (
        <WorksheetSubmissions />
      ) : (
        <WorksheetLabelling startLabelling={() => setStartLabelling(true)} />
      )}
    </div>
  );
};
