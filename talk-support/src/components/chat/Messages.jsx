import React from "react";

const ChatMessages = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 pt-8">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${
            msg.type === "outgoing" ? "justify-end" : "justify-start"
          } mb-4`}
        >
          <div
            className={`rounded-lg px-4 py-2 ${
              msg.type === "outgoing"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-800"
            }`}
          >
            <p>{msg.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
