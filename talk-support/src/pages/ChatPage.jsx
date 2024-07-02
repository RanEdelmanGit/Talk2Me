import React, { useState } from "react";
import Sidebar from "../components/chat/SideBar";
import ChatHeader from "../components/chat/ChatHeader";
import ChatMessages from "../components/chat/Messages";
import ChatInput from "../components/chat/Input";

const ChatPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: "incoming", text: "Hey Bob, how's it going?", sender: "Alice" },
    {
      type: "outgoing",
      text: "Hi Alice! I'm good, just finished a great book. How about you?",
      sender: "Bob",
    },
    {
      type: "incoming",
      text: "That book sounds interesting! What's it about?",
      sender: "Alice",
    },
    {
      type: "outgoing",
      text: "It's about an astronaut stranded on Mars, trying to survive. Gripping stuff!",
      sender: "Bob",
    },
    {
      type: "incoming",
      text: "I'm intrigued! Maybe I'll borrow it from you when you're done?",
      sender: "Alice",
    },
    {
      type: "outgoing",
      text: "Of course! I'll drop it off at your place tomorrow.",
      sender: "Bob",
    },
    { type: "incoming", text: "Thanks, you're the best!", sender: "Alice" },
    {
      type: "outgoing",
      text: "Anytime! Let me know how you like it. 😊",
      sender: "Bob",
    },
    { type: "incoming", text: "So, pizza next week, right?", sender: "Alice" },
    {
      type: "outgoing",
      text: "Absolutely! Can't wait for our pizza date. 🍕",
      sender: "Bob",
    },
    { type: "incoming", text: "Hoorayy!!", sender: "Alice" },
  ]);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSendMessage = (message) => {
    setMessages([
      ...messages,
      { type: "outgoing", text: message, sender: "Bob" },
    ]);
  };

  return (
    <div className="flex h-[91vh] w-screen mt-16">
      <Sidebar isMenuOpen={isMenuOpen} handleMenuToggle={handleMenuToggle} />
      <div className="flex-1 flex flex-col ">
        <ChatHeader contactName="Alice" />
          <div className="overflow-y-scroll flex-1">
            <ChatMessages messages={messages} />
          </div>
        <ChatInput handleSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatPage;
