import React from "react";
import Chats from "./Chats";

const Sidebar = ({ isMenuOpen, handleMenuToggle }) => {
  return (
    <div className="w-1/4 bg-white border-r border-gray-300  ">
      <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-indigo-600 text-white">
        <h1 className="text-2xl font-semibold">Chat Web</h1>
        <div className="relative">
          <button
            id="menuButton"
            className="focus:outline-none"
            onClick={handleMenuToggle}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-100"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path d="M2 10a2 2 0 012-2h12a2 2 0 012 2 2 2 0 01-2 2H4a2 2 0 01-2-2z" />
            </svg>
          </button>
         
        </div>
      </header>
      <div className="overflow-auto h-[80vh] p-3 mb-9 pb-5">
        {[
          { name: "Alice", message: "Hoorayy!!", color: "ffa8e4" },
          { name: "Martin", message: "That pizza place was amazing!", color: "ad922e" },
          { name: "Alice", message: "Hoorayy!!", color: "ffa8e4" },
          { name: "Martin", message: "That pizza place was amazing!", color: "ad922e" },
          { name: "Alice", message: "Hoorayy!!", color: "ffa8e4" },
          { name: "Martin", message: "That pizza place was amazing!", color: "ad922e" },
          { name: "Alice", message: "Hoorayy!!", color: "ffa8e4" },
          { name: "Martin", message: "That pizza place was amazing!", color: "ad922e" },
          { name: "Alice", message: "Hoorayy!!", color: "ffa8e4" },
          { name: "Martin", message: "That pizza place was amazing!", color: "ad922e" },
          // Add more contacts here
        ].map((contact, index) => (
          <Chats contact={contact} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
