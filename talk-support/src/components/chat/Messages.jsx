import React, { useEffect, useRef } from "react";

const ChatMessages = ({ messages }) => {
  const lastMessageRef = useRef();

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-2">
      {messages.map((msg, index) => (
        <div
          ref={lastMessageRef}
          key={index}
          className={`flex ${
            msg.type === "outgoing" ? "justify-end" : "justify-start"
          } mb-4`}
        >
          <div
            className={`relative rounded-lg px-4 py-2 ${
              msg.type === "outgoing"
                ? "bg-indigo-300 text-gray-800 text-right"
                : "bg-gray-300 text-gray-800"
            }`}
            style={{ maxWidth: "70%" }}
          >
            <p className="mb-4 text-lg" dir="rtl">
              {msg.text}
            </p>
            <p className="absolute bottom-0 right-0 text-xs text-gray-700 mb-1 mr-1">
              {new Date(msg.sentAt).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
