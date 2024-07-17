import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import {
  addFavorite,
  removeFavorite,
  initChat,
  updateUser,
  updateSupporter,
} from "../../redux/features/authSlice";

import { startChat, saveChat } from "../../redux/features/chatSlice";
import HeartSolidIcon from "../../assets/svgs/HeartSolidIcon";
import HeartRegularIcon from "../../assets/svgs/HeartRegularIcon";

const SupporterCard = ({
  supporter: {
    uid,
    firstName,
    lastName,
    name = firstName + " " + lastName,
    area,
    meeting,
    city,
    age,
    about,
    chats,
  },
  aboutOpen,
  toggleAbout,
  color, // Accept color prop
}) => {
  const { user } = useSelector((store) => store.auth);
  const [isFavorite, setIsFavorite] = useState(
    user.favorites && user.favorites.includes(uid)
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: "(max-width: 1200px)" });
  const chatId = uid + user.uid;

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);

    if (!isFavorite) {
      dispatch(addFavorite(uid));
    } else {
      dispatch(removeFavorite(uid));
    }
    dispatch(updateUser());
  };

  const handleStartChatClick = (e) => {
    e.stopPropagation();
    if (!chats.find((c) => c.chatId == chatId)) {
      // new chat
      dispatch(
        startChat({
          // creates a new chat in the chatslice
          clientId: user.uid,
          supporterId: uid,
          chatId: chatId,
          supporterName: `${firstName} ${lastName}`,
          clientName: user.nickname,
        })
      );
      dispatch(saveChat()); // saves the chat to firestore/chats collection

      dispatch(
        initChat({
          // creates a chat element in the client and supporter chat array
          chatId,
          supporterId: uid,
          supporterName: `${firstName} ${lastName}`,
        })
      );
      dispatch(updateUser());
      dispatch(
        updateSupporter({
          chatId,
          supporterId: uid,
          supporterName: `${firstName} ${lastName}`,
        })
      );
    }
    navigate(`/chat/${chatId}`, { state: { supporterId: uid } });
  };

  const avatarUrl = `https://placehold.co/200x/${color}/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato`;

  if (isMobile) {
    return (
      <div
        className="w-full mx-auto md:p-3 border-b border-gray-300"
        dir="rtl"
        onClick={toggleAbout}
      >
        <div className="flex flex-col items-start justify-between w-full py-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <img
                src={avatarUrl}
                alt="User Avatar"
                className="w-12 h-12 rounded-full"
              />
              <span className="w-32 h-8 text-ellipsis whitespace-nowrap">
                <h2 className="text-lg font-bold">{name}</h2>
              </span>
            </div>
            <button
              className="h-6 w-6 focus:outline-none"
              style={{ background: "transparent", border: "none", padding: 0 }}
              onClick={handleFavoriteClick}
            >
              {isFavorite ? (
               <HeartSolidIcon /> 
              ) : (
                 <HeartRegularIcon />
          
              )}
            </button>
          </div>
          <div className="flex w-full justify-start pr-12 gap-2">
            <span className="flex justify-center items-center">
              <h3 className="text-base text-gray-500">{age} | </h3>
            </span>
            <span className="flex justify-center items-center">
              <h3 className="text-base text-gray-500">{area} | </h3>
            </span>
            <span className="flex justify-center items-center">
              <h3 className="text-base text-gray-500">{city}</h3>
            </span>
            <span className="flex justify-center items-center cursor-pointer">
              <h3 className="text-base text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className={`size-6 transition-transform duration-300 ${
                    aboutOpen ? "rotate-180" : ""
                  }`}
                >
                  {aboutOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  )}
                </svg>
              </h3>
            </span>
          </div>
          <div className={`mt-4 mb-2 ${aboutOpen ? "" : "hidden"}`}>
            <h3 className="text-base text-gray-500">{about}</h3>
          </div>
          <div className="flex w-full justify-between mt-6">
            <span className="flex flex-wrap justify-around items-center gap-2">
              {Array.isArray(meeting) ? (
                meeting.map((meet, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
                  >
                    {meet}
                  </span>
                ))
              ) : (
                <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                  {meeting}
                </span>
              )}
            </span>
            <button
              className="rounded-md bg-indigo-600 px-2 py-1 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleStartChatClick}
            >
              {chats.find((c) => c.chatId == chatId)
                ? "המשך שיחה"
                : "התחל שיחה"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full mx-auto md:p-3 border-b border-gray-300 flex flex-col"
      dir="rtl"
      onClick={toggleAbout}
    >
      <div className="flex items-center justify-between w-full px-10 sm:p-3 sm:gap-3 ">
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="w-12 h-12 rounded-full"
        />
        <span className="w-32 h-8 overflow-hidden text-ellipsis whitespace-nowrap">
          <h2 className="text-xl font-bold">{name}</h2>
        </span>
        <span className="flex justify-center items-center w-10">
          <h3 className="text-base text-gray-500">{age}</h3>
        </span>
        <span className="flex justify-center items-center w-10">
          <h3 className="text-base text-gray-500">{area}</h3>
        </span>
        <span className="flex justify-center items-center w-20">
          <h3 className="text-base text-gray-500">{city}</h3>
        </span>
        <span className="flex flex-wrap justify-around items-center w-48">
          {Array.isArray(meeting) ? (
            meeting.map((meet, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
              >
                {meet}
              </span>
            ))
          ) : (
            <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
              {meeting}
            </span>
          )}
        </span>
        <button
          className="rounded-md bg-indigo-600 px-2 py-1 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={handleStartChatClick}
        >
          {chats.find((c) => c.chatId == chatId) ? "המשך שיחה" : "התחל שיחה"}
        </button>
        <button
          className="h-6 w-6 focus:outline-none"
          style={{ background: "transparent", border: "none", padding: 0 }}
          onClick={handleFavoriteClick}
        >
          {isFavorite ? (
        <HeartSolidIcon /> 
          ) : (
         <HeartRegularIcon />
          )}
        </button>
      </div>
      <div className={`my-4 flex justify-center ${aboutOpen ? "" : "hidden"}`}>
        <h3 className="text-base text-gray-500">{about}</h3>
      </div>
    </div>
  );
};

export default SupporterCard;
