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
} from "@chakra-ui/react";

import { Card, CardHeader, CardBody, CardFooter, Text } from "@chakra-ui/react";
import { Section } from "src/components/Section";
import { useNavigate } from "react-router";
import { BaseRoute } from "src/constants/routes";

import { useUploadImage } from "src/hooks/api";

type UploadWorksheetsProps = {
  onClose: () => void;
  isOpen: boolean;
};

const UploadWorksheetsModal: React.FC<UploadWorksheetsProps> = ({
  isOpen,
  onClose,
}) => {
  const uploadImage = useUploadImage();

  const imageInput = useRef(null);
  const [answerKey, setAnswerKey] = useState<File>();
  const [emptySheet, setEmptySheet] = useState<File>();

  const handleSendImage = () => {
    onClose();
    uploadImage(answerKey);
    uploadImage(emptySheet);

    // cleanup
    setAnswerKey(undefined);
    setEmptySheet(undefined);
  };

  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Upload Empty Worksheet</FormLabel>
              <Input
                type="file"
                accept="image/*"
                ref={imageInput}
                onChange={(event) => setEmptySheet(event.target.files?.[0])}
                className="ms-2 btn btn-primary"
                disabled={!!emptySheet}
              />
              <FormHelperText>Please upload a blank worksheet</FormHelperText>
              <FormLabel>Upload Answer Sheet</FormLabel>
              <Input
                type="file"
                accept="image/*"
                ref={imageInput}
                onChange={(event) => setAnswerKey(event.target.files?.[0])}
                className="ms-2 btn btn-primary"
                disabled={!!answerKey}
              />
              <FormHelperText>Please upload your answer key</FormHelperText>
              <Button
                disabled={!answerKey || !emptySheet}
                onClick={handleSendImage}
              >
                <Text>Upload Worksheet</Text>
              </Button>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export const Worksheets = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [state, setState] = useState<"uploading" | "labelling" | "done">();

  const handleUploadWorksheet = () => {
    onOpen();
    setState("uploading");
  };

  return (
    <div className="Worksheets">
      <Button onClick={handleUploadWorksheet}>Add worksheet</Button>

      <Section>
        <List spacing={6}>
          {Array.from(Array(30).keys()).map((id) => (
            <ListItem>
              <Card>
                <Link onClick={() => navigate(`${BaseRoute.WORKSHEETS}/${id}`)}>
                  <CardBody>
                    <Text>{`Worksheet ${id}`}</Text>
                  </CardBody>
                </Link>
              </Card>
            </ListItem>
          ))}
        </List>
      </Section>
      <UploadWorksheetsModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};
