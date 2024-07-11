import React, { useEffect, useRef } from "react";

const ChatMessages = ({ messages }) => {
  const ref = useRef();
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-2">
      {messages.map((msg, index) => (
        <div
          ref={ref}
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
            <p className="text-xs text-gray-400">
              {new Date(msg.sentAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
