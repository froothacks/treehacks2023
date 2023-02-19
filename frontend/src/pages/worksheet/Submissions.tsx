import React, { useEffect, useState, useRef } from "react";
import {
  List,
  ListItem,
  Link,
  useDisclosure,
  Button,
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
  Box,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import { Id } from "src/convex/_generated/dataModel";

import { Card, CardHeader, CardBody, CardFooter, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { BaseRoute, QueryParams } from "src/constants/routes";
import { useMutation, useQuery } from "src/convex/_generated/react";
import { useUploadImage } from "src/hooks/api";
import { AddIcon } from "@chakra-ui/icons";
import styled from "@emotion/styled";

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
  const [submissions, setSubmissions] = useState<FileList | null>(null);

  const handleCreateSubmission = async () => {
    if (submissions) {
      const res = await Promise.all(
        Array.from(submissions).map(async (sub) => {
          const submissionImageID = await uploadImage(sub);

          const { submissionId } = await createSubmission(
            worksheet_id,
            submissionImageID
          );
          return submissionId;
        })
      );

      // cleanup
      setSubmissions(null);

      onClose();
      // if (res.length == 1) {
      //   navigate(`${BaseRoute.SUBMISSIONS}/${res[0]}`);
      // }
    }
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
                onChange={(event) => setSubmissions(event.target.files)}
                className="ms-2 btn btn-primary"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              mr={4}
              disabled={!submissions?.length}
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

const MotionCard = styled(Card)`
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: scale(1.01);
  }
`;

export const WorksheetSubmissions = () => {
  const params = useParams();
  const navigate = useNavigate();
  const ws_id = params[QueryParams.WORKSHEET_ID] ?? "";
  const worksheet = useQuery(
    "listMessages:getWorksheet",
    new Id("worksheets", ws_id)
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const submissions =
    useQuery("listMessages:getAllSubmissionsForWorksheet", ws_id) ?? [];

  console.log({ worksheet });

  const startGrading = () => {
    console.log(ws_id);
    fetch("http://localhost:5000/start_grading", {
      method: "POST",
      body: JSON.stringify({
        worksheetId: ws_id,
      }),
    });
  };

  return (
    <div>
      <Box display={"flex"} justifyContent="space-between">
        <Heading>Submissions</Heading>
        <Box>
          <Button onClick={onOpen} leftIcon={<AddIcon boxSize={3} />}>
            <Text>Create</Text>
          </Button>
          <Spacer w={4} />
          <Button onClick={startGrading}>Start Grading</Button>
        </Box>
      </Box>

      <List spacing={3}>
        {submissions.map((sub: any) => {
          const id = sub._id.id;
          return (
            <ListItem>
              <MotionCard key={id} boxShadow="lg" borderRadius={16}>
                <CardBody>
                  <Box display={"flex"} justifyContent="space-between">
                    <Text>Advait's Submission</Text>
                    {/* <Text>Score: </Text> */}
                    <Box display={"flex"} alignItems="center">
                      <Text mr="3">Grading</Text>
                      <Spinner size={"sm"} />
                    </Box>
                    {/* <Text>Score: </Text> */}
                  </Box>
                </CardBody>
              </MotionCard>
            </ListItem>
          );
        })}
      </List>
      <UploadSubmissionModal
        isOpen={isOpen}
        onClose={onClose}
        worksheet_id={ws_id}
      />
    </div>
  );
};
