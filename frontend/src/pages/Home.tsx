import React from "react";
import { useQuery, useMutation } from "src/convex/_generated/react";
import { useRef, useState } from "react";
import { Section } from "src/components/Section";
import { Link } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { BaseRoute } from "src/constants/routes";

function Image({ message }: { message: any }) {
  return <img src={message.url} height="300px" width="auto" />;
}

export const Home = () => {
  const messages = useQuery("listMessages") ?? [];

  // const data = useQuery("listMessages");
  const sendMessage = useMutation("sendMessage:sendMessage");
  const sendHello = () => sendMessage("Hello!", "me2");

  const [name] = useState(() => "User " + Math.floor(Math.random() * 10000));

  const imageInput = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const generateUploadUrl = useMutation("sendMessage:generateUploadUrl");
  const sendImage = useMutation("sendMessage:sendImage");

  // async function handleSendMessage(event) {
  //   event.preventDefault();
  //   setNewMessageText("");
  //   if (newMessageText) {
  //     await sendMessage(newMessageText, name);
  //   }
  // }

  // @ts-ignore
  async function handleSendImage(event) {
    event.preventDefault();
    setSelectedImage(null);
    // @ts-ignore
    imageInput.current.value = "";

    const postUrl = await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: "POST",
      // @ts-ignore
      headers: { "Content-Type": selectedImage.type },
      body: selectedImage,
    });
    const { storageId } = await result.json();
    await sendImage(storageId, name);
  }

  const navigate = useNavigate();

  return (
    <Section>
      <Link onClick={() => navigate(BaseRoute.WORKSHEETS)} fontSize={48}>
        View Worksheets
      </Link>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <button onClick={sendHello}>click me!</button>
      <form onSubmit={handleSendImage}>
        <ul>
          {messages.map((message: any) => (
            <li key={message._id.toString()}>
              <span>{message.author}:</span>
              {message.format === "image" ? (
                <Image message={message} />
              ) : (
                <span>{message.body}</span>
              )}
              <span>
                {new Date(message._creationTime).toLocaleTimeString()}
              </span>
            </li>
          ))}
        </ul>
        <input
          type="file"
          accept="image/*"
          ref={imageInput}
          // @ts-ignore
          onChange={(event) => setSelectedImage(event.target.files[0])}
          className="ms-2 btn btn-primary"
          // @ts-ignore
          disabled={selectedImage}
        />
        <input type="submit" value="Send Image" disabled={!selectedImage} />
      </form>
    </Section>
  );
};
