import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";
import { UserProvider, useUser } from "./context/userContext";
import { ChatContextProvider } from "./context/chatContext";
import { store } from "./redux/store.js";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <UserProvider>
      <ChatContextProvider>
          <App />
      </ChatContextProvider>
    </UserProvider>
  </Provider>
);
