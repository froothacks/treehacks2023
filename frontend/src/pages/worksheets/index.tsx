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
  useToast,
  SimpleGrid,
  Heading,
  HStack,
  Box,
  SkeletonText,
} from "@chakra-ui/react";

import { Card, CardHeader, CardBody, CardFooter, Text } from "@chakra-ui/react";
import { Section } from "src/components/Section";
import { useNavigate } from "react-router";
import { BaseRoute } from "src/constants/routes";

import { useUploadImage } from "src/hooks/api";
import { useMutation, useQuery } from "src/convex/_generated/react";
import { AddIcon, PlusSquareIcon } from "@chakra-ui/icons";
import styled from "@emotion/styled";

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
  const toast = useToast();
  const createWorksheet = useMutation("sendMessage:createWorksheet");

  const imageInput = useRef(null);
  const [name, setName] = useState("");
  const [answerKey, setAnswerKey] = useState<File>();
  const [blankWorksheet, setBlankWorksheet] = useState<File>();

  const handleCreateWorksheet = async () => {
    try {
      const answerKeyWorksheetID = await uploadImage(answerKey);
      const blankWorksheetID = await uploadImage(blankWorksheet);

      const { worksheetId } = await createWorksheet(
        name,
        "asx35pHuC8dhWHrhZ-lLzg",
        "temp_date",
        answerKeyWorksheetID,
        blankWorksheetID
      );
      toast({
        title: `A new worksheet has been successfully created :)`,
        status: "success",
        isClosable: true,
        position: "bottom-right",
      });

      // cleanup
      setAnswerKey(undefined);
      setBlankWorksheet(undefined);

      onClose();
      navigate(`${BaseRoute.WORKSHEETS}/${worksheetId}`);
    } catch (_) {
      toast({
        title: `Unfortunately, something went wrong along the way :( `,
        status: "error",
        isClosable: true,
        position: "bottom-right",
      });
    }
  };

  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading>Create Worksheet</Heading>
          </ModalHeader>
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

const MotionCard = styled(Card)`
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: scale(1.08);
  }
`;

export const Worksheets = () => {
  const navigate = useNavigate();

  const worksheets = useQuery("listMessages:getAllWorksheets");
  const { isOpen, onOpen, onClose } = useDisclosure();

  // console.log({ worksheets });

  // const worksheets = undefined;

  return (
    <div className="Worksheets">
      <Section>
        <Box display={"flex"} justifyContent="space-between">
          <Heading>Worksheets</Heading>
          <Button onClick={onOpen} leftIcon={<AddIcon boxSize={3} />}>
            <Text>Create</Text>
          </Button>
        </Box>
        <Spacer h={10} />
        <SimpleGrid
          spacingX={6}
          spacingY={10}
          templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
        >
          {worksheets
            ? worksheets.map((ws: any) => {
                const id = ws._id.id;
                return (
                  <MotionCard key={id} boxShadow="lg" borderRadius={16}>
                    <CardHeader>
                      <Heading size="md">{ws.name}</Heading>
                    </CardHeader>
                    <CardBody>
                      <Text>Class: Gr8-Math</Text>
                      <Text>Students: 35</Text>
                      <Text>Due: 13/02/2022</Text>
                    </CardBody>
                    <CardFooter>
                      <Button
                        onClick={() =>
                          navigate(`${BaseRoute.WORKSHEETS}/${id}`)
                        }
                        variant={"solid"}
                        size="md"
                        width={"100%"}
                      >
                        <Text>View</Text>
                      </Button>
                    </CardFooter>
                  </MotionCard>
                );
              })
            : Array.from(Array(16).keys()).map(() => (
                <Box padding="6" boxShadow="lg" borderRadius={16} bg="white">
                  <SkeletonText mt="4" noOfLines={6} spacing="4" />
                </Box>
              ))}
        </SimpleGrid>
      </Section>
      <UploadWorksheetsModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};
