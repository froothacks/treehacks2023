import React from "react";
import {useQuery, useMutation} from "src/convex/_generated/react";
import {useRef, useState} from "react";

function Image({message}: { message: any }) {
    return <img src={message.url} height="300px" width="auto"/>;
}

export const Home = () => {
    const messages = useQuery("listMessages") || [];

    // const data = useQuery("listMessages");
    const sendMessage = useMutation("sendMessage:sendMessage");
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

    // @ts-ignore
    async function handleSendImage(event) {
        event.preventDefault();
        await Promise.all([answerKey, blankWorksheet].map(async (ws) => {
            if (!ws) return

            const postUrl = await generateUploadUrl();
            const result = await fetch(postUrl, {
                method: "POST",
                headers: {"Content-Type": ws.type},
                body: ws,
            });
            const {storageId} = await result.json();
            console.log("Got", storageId)
            await sendImage(storageId, name);
        }))
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
