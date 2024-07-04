import React from "react";

const ChatHeader = ({ contactName }) => {
  return (
    <header className="bg-white p-4 text-gray-700">
      <h1 className="text-2xl font-semibold">{contactName}</h1>
    </header>
  );
};

export default ChatHeader;
