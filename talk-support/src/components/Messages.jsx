import React, { useEffect, useState } from "react";
import Message from "./Message";
import { useChat } from "../context/chatContext";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase_config";

export default function Messages() {
  const { data } = useChat();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const fetchedMessages = docSnapshot.data().messages || [];
        setMessages(fetchedMessages);
      } else {
        setMessages([]);
      }
    });
    console.log("Messages:", messages);
    return () => {
      unSub();
    };
  }, [data.chatId]);

  return (
    <div className="messages">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
}
