import {Image} from "@chakra-ui/react";

import {Card, CardHeader, CardBody, CardFooter, Text} from "@chakra-ui/react";
import {useParams} from "react-router-dom";
import {QueryParams} from "src/constants/routes";
import {Section} from "src/components/Section";
import {useQuery} from "src/convex/_generated/react";
import {Id} from "src/convex/_generated/dataModel";
import WorksheetDisplay from "../../components/WorksheetDisplay";

export const Submission = () => {
    const params = useParams();

    const sub_id = params[QueryParams.SUBMISSION_ID];
    const submission = useQuery(
        "listMessages:getSubmission",
        new Id("submissions", sub_id ?? "")
    );
    const boxes = useQuery(
        "listMessage:getBB",
        new Id("worksheets",submission.worksheet_id)
    )

    return (
        <Section style={{height: "100%"}}>
            <div className="Submission ">Submission</div>
            {submission && <Text>ID: {submission._id.id}</Text>}
        <WorksheetDisplay boxes={boxes} submission={submission}/>
        </Section>
    );
};
