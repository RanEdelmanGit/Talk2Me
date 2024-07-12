import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Chats({ contact, handleMenuToggle, chatId, index }) {
  const nav = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (index == 0 && !params.chatId) {
      nav(`/chat/${chatId}`);
      handleMenuToggle();
    }
  }, [index]);
  return (
    <div
      className="flex items-center py-3 px-2 md:px-6 cursor-pointer hover:bg-gray-100 rounded-md"
      onClick={() => {
        nav(`/chat/${chatId}`);
        handleMenuToggle();
      }}
    >
      <div className={`w-12 h-12 bg-gray-300 rounded-full ml-4`}>
        <img
          src={`https://placehold.co/200x/${contact.color}/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato`}
          alt="User Avatar"
          className="w-12 h-12 rounded-full"
        />
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-semibold">{contact.displayName}</h2>
        {/* <p className="text-gray-600">{contact.message}</p> */}
      </div>
    </div>
  );
}
