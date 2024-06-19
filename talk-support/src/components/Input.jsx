import React, { useState } from "react";
import { useUser } from "../context/userContext";
import { useChat } from "../context/chatContext";
import {
  arrayUnion,
  doc,
  updateDoc,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase_config";
import { v4 as uuid } from "uuid";

export default function Input() {
  const [text, setText] = useState("");
  const { user } = useUser();
  const { data } = useChat();

  const handleSend = async () => {
    if (text.trim() === "") return;
    await updateDoc(doc(db, "chats", data.chatId), {
      messages: arrayUnion({
        id: uuid(),
        text,
        senderId: user.uid,
        date: Timestamp.now(),
      }),
    });
    await updateDoc(doc(db, "userChats", user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
    setText("");
  };

  const handleKey = (e) => {
    if (e.code === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type Something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
        onKeyDown={handleKey}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
