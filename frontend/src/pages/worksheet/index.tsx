import React, { useEffect, useState, useRef } from "react";
import { Id } from "src/convex/_generated/dataModel";

import { useNavigate, useParams } from "react-router-dom";
import { BaseRoute, QueryParams } from "src/constants/routes";
import { useMutation, useQuery } from "src/convex/_generated/react";
import { WorksheetSubmissions } from "./Submissions";
import { WorksheetLabelling } from "./Labelling";
import { Section } from "src/components/Section";
import { Button } from "@chakra-ui/react";

const usePollingUpdate = (pollingFunction: () => void, interval: number) => {
  const [subscription, setSubscription] = useState(null);
  useEffect(() => {
    const id = setInterval(pollingFunction, interval);
    setSubscription(id as any);
    return () => {
      if (subscription) {
        clearInterval(subscription);
      }
    };
  }, []);
};

export const Worksheet = () => {
  const params = useParams();
  const ws_id = params[QueryParams.WORKSHEET_ID] ?? "";
  const worksheet = useQuery(
    "listMessages:getWorksheet",
    new Id("worksheets", ws_id)
  );
  const [didUpdateBoundingBoxes, setUpdateBoundingBoxes] = useState(false);

  usePollingUpdate(() => {
    if (worksheet && worksheet.ocr_done) {
      setUpdateBoundingBoxes(true);
    }
  }, 5001);

  return (
    <Section>
      <Button onClick={() => setUpdateBoundingBoxes((prev) => !prev)}>
        Toggle
      </Button>
      {didUpdateBoundingBoxes ? (
        <WorksheetSubmissions />
      ) : (
        <WorksheetLabelling />
      )}
    </Section>
  );
};
