import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./theme";

const address = process.env.REACT_APP_CONVEX_URL ?? "";

const convex = new ConvexReactClient(address);
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ConvexProvider client={convex}>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </ConvexProvider>
    </BrowserRouter>
  </React.StrictMode>
);
