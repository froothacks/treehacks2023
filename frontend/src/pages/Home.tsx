import React from "react";
import {useQuery, useMutation} from "src/convex/_generated/react";
import {useRef, useState} from "react";
import { Section } from "src/components/Section";
import { Link } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { BaseRoute } from "src/constants/routes";

function Image({message}: { message: any }) {
    return <img src={message.url} height="300px" width="auto"/>;
}



export const Home = () => {
    const getAllWorksheets = useQuery("listMessages:getAllWorksheets") || [];

    // const data = useQuery("listMessages");
    const sendMessage = useMutation("sendMessage:sendMessage");
    const createWorksheet = useMutation("sendMessage:createWorksheet");
    const sendHello = () => sendMessage("Hello!", "me2");


    const [name] = useState(() => "User " + Math.floor(Math.random() * 10000));

    const [answerKey, setAnswerKey] = useState<File | null>(null);
    const [blankWorksheet, setBlankWorksheet] = useState<File | null>(null);

    const generateUploadUrl = useMutation("sendMessage:generateUploadUrl");
    const sendImage = useMutation("sendMessage:sendImage");

    // async function handleSendMessage(event) {
    //   event.preventDefault();
    //   setNewMessageText("");
    //   if (newMessageText) {
    //     await sendMessage(newMessageText, name);
    //   }
    // }

    async function uploadToStorage(ws: any) {
      if (!ws) return
  
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
          method: "POST",
          headers: {"Content-Type": ws.type},
          body: ws,
      });
      const {storageId} = await result.json();
      console.log("Got", storageId)
      return storageId;
  }

    // @ts-ignore
    async function handleSendImage(event) {
        event.preventDefault();
        const answerKeyWorksheetID = await uploadToStorage(answerKey);
        const blankWorksheetID = await uploadToStorage(blankWorksheet);
        const {worksheetId, answerURL, blankURL} = await createWorksheet("worksheet_name", "asx35pHuC8dhWHrhZ-lLzg", "temp_date", answerKeyWorksheetID, blankWorksheetID)
        const boundingBoxes = await fetch("http://127.0.0.1:5000/bb", {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
                ans_url: answerURL,
                blank_url: blankURL,
            })
        })
        const data = await boundingBoxes.json()
        setBlankWorksheet(null);
        setAnswerKey(null);
    }

    // <ul>
    // {messages.map((message: any) => (
    //          <li key={message._id.toString()}>
    //            <span>{message.author}:</span>
    //            {message.format === "image" ? (
    //              <Image message={message} />
    //            ) : (
    //              <span>{message.body}</span>
    //            )}
    //            <span>{new Date(message._creationTime).toLocaleTimeString()}</span>
    //          </li>
    //        ))}
    // </ul>

    return (
        <div>
              <ul>
            {getAllWorksheets.map((worksheet: any) => (
                    <li key={worksheet._id.toString()}>
                      <span>{worksheet.name}:</span>
                      <Image message={worksheet.answer_url} />
                      <span>{new Date(worksheet._creationTime).toLocaleTimeString()}</span>
                    </li>
                  ))}
            </ul>
            <h1 className="text-3xl font-bold underline">Hello world!</h1>
            <button onClick={sendHello}>click me!</button>
            <form onSubmit={handleSendImage}>
                <label>Answer Key</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={event => {
                        if (event.target.files)
                            setAnswerKey(event.target.files[0])
                    }}
                    className="ms-2 btn btn-primary"
                    disabled={!!answerKey}
                />
                <label>Blank Worksheet</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={event => {
                        if (event.target.files)
                            setBlankWorksheet(event.target.files[0])
                    }}
                    className="ms-2 btn btn-primary"
                    disabled={!!blankWorksheet}
                />
                <input type="submit" value="Send Image" disabled={!blankWorksheet && !answerKey}/>
            </form>
        </div>
    );
};
