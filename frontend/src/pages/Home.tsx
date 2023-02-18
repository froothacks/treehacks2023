import React from "react";
import { useMutation } from "src/convex/_generated/react";

export const Home = () => {
  const sendMessage = useMutation("sendMessage");
  const sendHello = () => sendMessage("Hello!", "me");

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <button onClick={sendHello}>click me!</button>
    </div>
  );
};
