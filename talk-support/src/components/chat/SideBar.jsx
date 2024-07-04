import React from "react";
import Chats from "./Chats";

const Sidebar = ({ isMenuOpen, handleMenuToggle }) => {
  return (
    <div className="h-20">
      {/* Sidebar */}
      <div
        className={`${
          isMenuOpen ? 'fixed top-0 left-0 w-full h-full' : 'hidden md:block '
        } bg-white border-r border-gray-300 z-40`}
      >
        <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-indigo-600 text-white">
          <h1 className="text-2xl font-semibold">Chat Web</h1>
          {/* Close button in header */}
          {isMenuOpen && (
            <button
              className="md:hidden p-2 text-white rounded"
              onClick={handleMenuToggle}
            >
              X
            </button>
          )}
        </header>
        <div className="overflow-auto h-[80vh] p-3 mb-9 pb-5">
          {[
            {
              name: "Alice",
              message: "Hoorayy!!",
              color: "ffa8e4",
              chatId: "xwOsupvBN3UTc0uHKmfRKeY13aa2GInubgcAXUbiZKu4iJhdULX1r9h1",
            },
            {
              name: "Martin",
              message: "That pizza place was amazing!",
              color: "ad922e",
              chatId: "xwOsupvBN3UTc0uHKmfRKeY13aa2GInubgcAXUbiZKu4iJhdULX1r9h1",
            },
            { name: "Alice", message: "Hoorayy!!", color: "ffa8e4" },
            {
              name: "Martin",
              message: "That pizza place was amazing!",
              color: "ad922e",
            },
            { name: "Alice", message: "Hoorayy!!", color: "ffa8e4" },
            {
              name: "Martin",
              message: "That pizza place was amazing!",
              color: "ad922e",
            },
            { name: "Alice", message: "Hoorayy!!", color: "ffa8e4" },
            {
              name: "Martin",
              message: "That pizza place was amazing!",
              color: "ad922e",
            },
            { name: "Alice", message: "Hoorayy!!", color: "ffa8e4" },
            {
              name: "Martin",
              message: "That pizza place was amazing!",
              color: "ad922e",
            },
            // Add more contacts here
          ].map((contact, index) => (
            <Chats contact={contact} key={index} />
          ))}
        </div>
      </div>

      {/* Overlay for closing the sidebar when clicking outside */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30"
          onClick={handleMenuToggle}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
