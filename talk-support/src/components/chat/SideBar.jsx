import React, { useEffect, useState } from "react";
import Chats from "./Chats";
import Header from "../layout/Header";
import { useDispatch, useSelector } from "react-redux";
import colors from "../../constants/profileColors";
import { useNavigate } from "react-router-dom";
import Loading from "../common/Loading";

const Sidebar = ({ isMenuOpen, handleMenuToggle }) => {
  const userChats = useSelector((store) => store.auth.user.chats);
  const { chats, status } = useSelector((store) => store.chat);
  const { userType, user } = useSelector((state) => state.auth);
  // const dispatch = useDispatch();
  const nav = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!chats || status == "loading") return;

    if (chats.length === 0) {
      nav("/supporters");
    }

    //dispatch(loadChats({ userChats: userChats.map((c) => c.chatId) })); // loads user chats into chats selector
  }, [userChats]);

  
  if (!chats || chats.length === 0) {
    <div className="flex w-full min-h-screen justify-center items-center">
      <Loading show={true} />
    </div>;
  }

  const getLastUpdate = (chatId) => {
    const chat = chats.find((chat) => chat.id === chatId);
    if (chat) {
      if(chat.lastUpdate)
        return chat.lastUpdate;
      return new Date().toISOString();
    }
    return new Date().toISOString();
  };

  return (
    <div>
      {/* Sidebar */}
      <div
        className={`${
          isMenuOpen
            ? "fixed top-0 md:top-16 right-0 max-md:w-full h-full"
            : "hidden md:block"
        } bg-white z-40`}
      >
        {user.uid && <Header user={user} userType={userType} />}
        <header
          className="p-4 border-b max-md:mt-16 border-gray-300 flex justify-between items-center bg-gray-200"
          dir="rtl"
        >
          <h1 className="text-2xl font-semibold ml-4">שיחות</h1>
          {/* Close button in header */}
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg h-8 border-gray-300 focus:ring-indigo-500"
            placeholder="חפש לפי שם ..."
          />
        </header>
        <div
          className="overflow-auto h-[83vh] max-md:h-[73vh] mb-9 pb-5 border-l border-gray-300"
          dir="rtl"
        >
          {chats &&
            chats
              .map((c) => ({
                displayName:
                  userType == "client" ? c.supporterName : c.clientName,
                chatId: c.id,
                lastUpdate: getLastUpdate(c.id),
              }))
              .sort((c1, c2) => c2.lastUpdate.localeCompare(c1.lastUpdate))
              .filter((c) =>
                search == "" ? true : c.displayName.includes(search)
              )
              .map((contact, index) => (
                <div key={index} className="border-b border-gray-200">
                  <Chats
                    contact={{
                      ...contact,
                      color: colors[index % colors.length],
                    }}
                    index={index}
                    handleMenuToggle={handleMenuToggle}
                    chatId={contact.chatId}
                  />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
