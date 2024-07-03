import React, { useState } from "react";
import Sidebar from "../components/chat/SideBar";
import ChatHeader from "../components/chat/ChatHeader";
import ChatMessages from "../components/chat/Messages";
import ChatInput from "../components/chat/Input";
import { useSelector, useDispatch } from "react-redux";
import { addMassage } from "../redux/features/chatSlice";

const ChatPage = () => {
  const { massages } = useSelector((store) => store.chat.chat);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSendMessage = (message) => {
    dispatch(addMassage({ type: "outgoing", text: message, sender: "Alice" }));
    // setMessages([
    //   ...messages,
    //   { type: "outgoing", text: message, sender: "Bob" },
    // ]);
  };

  return (
    <div className="flex h-[91vh] w-screen mt-16">
      <Sidebar isMenuOpen={isMenuOpen} handleMenuToggle={handleMenuToggle} />
      <div className="flex-1 flex flex-col ">
        <ChatHeader contactName="Alice" />
        <div className="overflow-y-scroll flex-1">
          <ChatMessages messages={massages} />
        </div>
        <ChatInput handleSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatPage;
