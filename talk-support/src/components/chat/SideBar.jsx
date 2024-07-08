import React, { useEffect } from "react";
import Chats from "./Chats";
import Header from "../layout/Header";
import { useDispatch, useSelector } from "react-redux";
import { loadChats } from "../../redux/features/chatSlice";
import colors from "../../profileColors";
import { loadSupporterByChats } from "../../redux/features/supportersSlice";

const Sidebar = ({ isMenuOpen, handleMenuToggle }) => {
  
  const { contactedSupporters } = useSelector((store) => store.supporters);
  const userChats = useSelector((store) => store.auth.user.chats);
  const { userType, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userChats) return;

    dispatch(loadChats({ userChats: userChats.map((c) => c.chatId) }))
      .unwrap()
      .then((chats) => {
        const supporterIds = [];

        for (let index = 0; index < chats.length; index++) {
          const element = chats[index];
          supporterIds.push(element.supporterId);
        }
        dispatch(loadSupporterByChats({ supporterIds }));
      });
  }, [userChats]);


  
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
            className="rounded-lg h-8 border-gray-300 focus:ring-indigo-500"
            placeholder="חפש לפי שם ..."
          />
        </header>
        <div
          className="overflow-auto h-[83vh] max-md:h-[73vh] mb-9 pb-5 border-l border-gray-300"
          dir="rtl"
        >
          {contactedSupporters.map((contact, index) => (
            <div key={index} className="border-b border-gray-200">
              <Chats
                contact={{
                  ...contact,
                  color: colors[index % colors.length],
                }}
                handleMenuToggle={handleMenuToggle}
                chatId={contact.uid + user.uid}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
