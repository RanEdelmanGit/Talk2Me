import React from "react";
import Messages from "./Messages";
import Input from "./Input";
import { useChat } from "../../context/chatContext";
import '../../styles/index.css';

export default function Chat() {
  const { data } = useChat();
  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
      </div>
      <Messages />
      <Input />
    </div>
  );
}
