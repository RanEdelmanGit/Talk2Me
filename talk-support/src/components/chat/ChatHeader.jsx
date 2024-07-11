import React from "react";

const ChatHeader = ({ contactName, isMenuOpen, handleMenuToggle }) => {
  return (
    <header className="bg-white px-2 max-md:py-4 md:p-4 text-gray-700 border-b flex justify-between items-center">
       <h1 className="text-2xl font-semibold max-md:pr-4">{contactName}</h1>
      <button
        className="md:hidden p-2 text-black rounded"
        onClick={handleMenuToggle}
      >
        {isMenuOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        )}
      </button>

    </header>
  );
};

export default ChatHeader;
