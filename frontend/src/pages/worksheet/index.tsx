import React, { useEffect, useState, useRef } from "react";
import { Id } from "src/convex/_generated/dataModel";

import { useNavigate, useParams } from "react-router-dom";
import { BaseRoute, QueryParams } from "src/constants/routes";
import { useMutation, useQuery } from "src/convex/_generated/react";
import { WorksheetSubmissions } from "./Submissions";
import { WorksheetLabelling } from "./Labelling";
import { Section } from "src/components/Section";

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

    const startGrading = () => {
        console.log(ws_id);
        fetch("http://localhost:5000/start_grading", {
            method: "POST",
            body: JSON.stringify({
                worksheetId: ws_id
            })
        })
    }

  usePollingUpdate(() => {
    if (worksheet && worksheet.ocr_done) {
      setUpdateBoundingBoxes(true);
    }
  }, 5000);

  return (
    <Section>
      {didUpdateBoundingBoxes || true ? (
        <WorksheetSubmissions />
      ) : (
        <WorksheetLabelling />
      )}
    </Section>
  );
};
