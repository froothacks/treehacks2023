import React, { useRef, useState } from "react";
import {
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Spacer,
} from "@chakra-ui/react";

import { Card, CardHeader, CardBody, CardFooter, Text } from "@chakra-ui/react";
import { Section } from "src/components/Section";
import { useNavigate } from "react-router";
import { BaseRoute } from "src/constants/routes";

import { useUploadImage } from "src/hooks/api";
import { useMutation, useQuery } from "src/convex/_generated/react";

type UploadWorksheetsProps = {
  onClose: () => void;
  isOpen: boolean;
};

const UploadWorksheetsModal: React.FC<UploadWorksheetsProps> = ({
  isOpen,
  onClose,
}) => {
  const uploadImage = useUploadImage();
  const navigate = useNavigate();
  const createWorksheet = useMutation("sendMessage:createWorksheet");

  const imageInput = useRef(null);
  const [name, setName] = useState("");
  const [answerKey, setAnswerKey] = useState<File>();
  const [blankWorksheet, setBlankWorksheet] = useState<File>();

  const handleCreateWorksheet = async () => {
    const answerKeyWorksheetID = await uploadImage(answerKey);
    const blankWorksheetID = await uploadImage(blankWorksheet);

    const { worksheetId, answerURL, blankURL } = await createWorksheet(
      name,
      "asx35pHuC8dhWHrhZ-lLzg",
      "temp_date",
      answerKeyWorksheetID,
      blankWorksheetID
    );
    const boundingBoxes = await fetch(
      "https://agile-mole-403.convex.cloud/bb",
      {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
          ans_url: answerURL,
          blank_url: blankURL,
        }),
      }
    );

    console.log({ boundingBoxes });

    const data = await boundingBoxes.json();

    console.log({ data });

    // cleanup
    setAnswerKey(undefined);
    setBlankWorksheet(undefined);

    onClose();
    navigate(`${BaseRoute.WORKSHEETS}/${worksheetId}`);
  };

  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Worksheet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Worksheet Name</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
              <Spacer h={8} />
              <FormLabel>Upload Empty Worksheet</FormLabel>
              <Input
                type="file"
                accept="image/*"
                ref={imageInput}
                onChange={(event) => setBlankWorksheet(event.target.files?.[0])}
                className="ms-2 btn btn-primary"
              />
              <FormHelperText>Please upload a blank worksheet</FormHelperText>
              <Spacer h={8} />
              <FormLabel>Upload Answer Sheet</FormLabel>
              <Input
                type="file"
                accept="image/*"
                ref={imageInput}
                onChange={(event) => setAnswerKey(event.target.files?.[0])}
                className="ms-2 btn btn-primary"
              />
              <FormHelperText>Please upload your answer key</FormHelperText>
              <Spacer h={8} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              mr={4}
              disabled={!answerKey || !blankWorksheet}
              onClick={handleCreateWorksheet}
              variant={""}
            >
              <Text>Upload Worksheet</Text>
            </Button>

            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export const Worksheets = () => {
  const navigate = useNavigate();

  const worksheets = useQuery("listMessages:getAllWorksheets") ?? [];
  const { isOpen, onOpen, onClose } = useDisclosure();

  console.log({ worksheets });

  return (
    <div className="Worksheets">
      <Section>
        <Button onClick={onOpen}>Create worksheet</Button>
        <Spacer h={6} />
        <List spacing={6}>
          {worksheets.map((ws: any) => {
            const id = ws._id.id;
            return (
              <ListItem key={id}>
                <Card>
                  <Link
                    onClick={() => navigate(`${BaseRoute.WORKSHEETS}/${id}`)}
                  >
                    <CardBody>
                      <Text>
                        {ws.name} | {id}
                      </Text>
                    </CardBody>
                  </Link>
                </Card>
              </ListItem>
            );
          })}
        </List>
      </Section>
      <UploadWorksheetsModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};
