import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";
import { UserProvider, useUser } from "./context/userContext";
import { ChatContextProvider } from "./context/chatContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <UserProvider>
    <ChatContextProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ChatContextProvider>
  </UserProvider>
);
