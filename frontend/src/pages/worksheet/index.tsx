import React, { useEffect, useState, useRef } from "react";
import {
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
  Link,
  useDisclosure,
  Button,
  Box,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Spacer,
  Input,
  FormHelperText,
} from "@chakra-ui/react";
import WorksheetLabeller, { BoundingBoxType } from "src/components/WorksheetLabeller";
import { Id } from "src/convex/_generated/dataModel";

import { Card, CardHeader, CardBody, CardFooter, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { BaseRoute, QueryParams } from "src/constants/routes";
import { Section } from "src/components/Section";
import { useMutation, useQuery } from "src/convex/_generated/react";
import { useUploadImage } from "src/hooks/api";

type UploadWorksheetsProps = {
  worksheet_id: string;
  onClose: () => void;
  isOpen: boolean;
};

const UploadSubmissionModal: React.FC<UploadWorksheetsProps> = ({
  isOpen,
  onClose,
  worksheet_id,
}) => {
  const navigate = useNavigate();
  const uploadImage = useUploadImage();
  const createSubmission = useMutation("sendMessage:createSubmission");

  const imageInput = useRef(null);
  const [name, setName] = useState("");
  const [submission, setSubmission] = useState<File>();

  const handleCreateSubmission = async () => {
    const submissionImageID = await uploadImage(submission);

    const { submissionId } = await createSubmission(
      worksheet_id,
      submissionImageID
    );

    // cleanup
    setSubmission(undefined);

    onClose();
    navigate(`${BaseRoute.SUBMISSIONS}/${submissionId}`);
  };

  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Submission</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Student ID</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
              <Spacer h={8} />
              <FormLabel>Upload student's submission</FormLabel>
              <Input
                type="file"
                accept="image/*"
                ref={imageInput}
                onChange={(event) => setSubmission(event.target.files?.[0])}
                className="ms-2 btn btn-primary"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              mr={4}
              disabled={!submission}
              onClick={handleCreateSubmission}
              variant={""}
            >
              <Text>Upload Submission</Text>
            </Button>

            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};


export const Worksheet = () => {
  const params = useParams();
  const navigate = useNavigate();
  const ws_id = params[QueryParams.WORKSHEET_ID] ?? "";
  const worksheet = useQuery(
    "listMessages:getWorksheet",
    new Id("worksheets", ws_id)
  );

  console.log({ worksheet });

  const [boxes, setBoxes] = useState<Array<BoundingBoxType> | null>(null)

  useEffect(() => {
    const getBoundingBoxes = async () => {
      const boundingBoxes = await fetch("http://127.0.0.1:5000/bb", {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
                ans_url: worksheet.answer_url,
                blank_url: worksheet.blank_url,
            })
        })
        const data = await boundingBoxes.json()
        setBoxes(data)
    }
    if(worksheet?.answer_url && worksheet?.blank_url) getBoundingBoxes()
  }, [worksheet])


  return (
  <div>
  {boxes ? 
  <Box pb={8}>
    <WorksheetLabeller boxesInput={boxes} ansURL={worksheet.answer_url}/>
  </Box> : <Spinner />}
  </div>
  )

  // return (
  //   <Section>
  //     {worksheet && <Text>ID: {worksheet._id.id}</Text>}
  //     {/* <Button onClick={() => setUpdateBoundingBoxes((prev) => !prev)}>
  //       Toggle boolean
  //     </Button> */}
  //     <div className="Worksheet">
        
  //       {boxes ? <Box pb={8}>
  //         <WorksheetLabeller boxesInput={boxes} ansURL={worksheet.answer_url}/>
  //       </Box> : <Spinner />}
        

  //       {/* <List spacing={3}>
  //         {Array.from(Array(30).keys()).map((id) => (
  //           <ListItem>
  //             <Card>
  //               <Link
  //                 onClick={() => navigate(`${BaseRoute.SUBMISSIONS}/${id}`)}
  //               >
  //                 <CardBody>
  //                   <Text>{`Submission ${id}`}</Text>
  //                 </CardBody>
  //               </Link>
  //             </Card>
  //           </ListItem>
  //         ))}
  //       </List> */}
  //     </div>
  //   </Section>
  // );
};
