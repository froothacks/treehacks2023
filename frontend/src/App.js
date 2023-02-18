import logo from './logo.svg';
import './App.css';
import { useQuery } from "./convex/_generated/react";
import { useMutation } from "./convex/_generated/react";
import { useRef, useState } from "react";

function Image({ message }) {
  return <img src={message.url} height="300px" width="auto" />;
}

function App() {
  const messages = useQuery("listMessages") || [];

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

  async function handleSendImage(event) {
    event.preventDefault();
    setSelectedImage(null);
    imageInput.current.value = "";

    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();
    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": selectedImage.type },
      body: selectedImage,
    });
    const { storageId } = await result.json();
    // Step 3: Save the newly allocated storage id to the messages table
    await sendImage(storageId, name);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={sendHello}>click me!</button>
        <form onSubmit={handleSendImage}>
        <ul>
        {messages.map(message => (
          <li key={message._id.toString()}>
            <span>{message.author}:</span>
            {message.format === "image" ? (
              <Image message={message} />
            ) : (
              <span>{message.body}</span>
            )}
            <span>{new Date(message._creationTime).toLocaleTimeString()}</span>
          </li>
        ))}
      </ul>
        <input
          type="file"
          accept="image/*"
          ref={imageInput}
          onChange={event => setSelectedImage(event.target.files[0])}
          className="ms-2 btn btn-primary"
          disabled={selectedImage}
        />
        <input type="submit" value="Send Image" disabled={!selectedImage} />
      </form>
      </header>
    </div>
  );
}

export default App;
