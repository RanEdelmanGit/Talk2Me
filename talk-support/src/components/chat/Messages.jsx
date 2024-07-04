import React from "react";

const ChatMessages = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 pb-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${
            msg.type === "outgoing" ? "justify-end" : "justify-start"
          } mb-4`}
        >
          <div
            className={`rounded-lg p-4 ${
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
