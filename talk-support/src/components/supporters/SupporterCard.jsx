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

import profilePicPlaceholder from "./profile.jpg";
import heartSolid from "./heart-solid.svg";
import HeartRegular from "./heart-regular.svg";

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
    profilePic = profilePicPlaceholder,
  },
}) => {
  const { user } = useSelector((store) => store.auth);
  const [isFavorite, setIsFavorite] = useState(
    user.favorites && user.favorites.includes(uid)
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);

    if (!isFavorite) {
      dispatch(addFavorite(uid));
    } else {
      dispatch(removeFavorite(uid));
    }
    dispatch(updateUser());
  };

  const handleStartChatClick = () => {
    const chatId = uid + user.uid;
    dispatch(
      startChat({
        clientId: user.uid,
        supporterId: uid,
        chatId: chatId,
      })
    );
    dispatch(saveChat());
    dispatch(initChat({ chatId: chatId }));
    dispatch(updateUser());
    dispatch(updateSupporter({ supporterId: uid, chatId: chatId }));
    navigate(`/chat/${chatId}`, { state: { supporterId: uid } });
  };

  if (isMobile) {
    return (
      <div className="w-full mx-auto md:p-3 border-b border-gray-300" dir="rtl">
        <div className="flex flex-col items-start justify-between w-full py-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <img
                src={`https://placehold.co/200x/d4a8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato`}
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
                <img src={heartSolid} alt="Favorite" className="h-6 w-6" />
              ) : (
                <img
                  src={HeartRegular}
                  alt="Not Favorite"
                  className="h-6 w-6"
                />
              )}
            </button>
          </div>
          <div className="flex w-full justify-start pr-12 gap-2">
            <span className="flex justify-center items-center">
              <h3 className="text-sm text-gray-500">{age}</h3>
            </span>
              |
            <span className="flex justify-center items-center">
              <h3 className="text-sm text-gray-500">{area}</h3>
            </span>
            |
            <span className="flex justify-center items-center">
              <h3 className="text-sm text-gray-500">{city}</h3>
            </span>
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
              className="rounded-md bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleStartChatClick}
            >
              התחל שיחה
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto md:p-3 border-b border-gray-300" dir="rtl">
      <div className="flex items-center justify-between w-full px-10">
        <img
          src={`https://placehold.co/200x/d4a8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato`}
          alt="User Avatar"
          className="w-12 h-12 rounded-full"
        />

        <span className="w-32 h-8 overflow-hidden text-ellipsis whitespace-nowrap">
          <h2 className="text-lg font-bold">{name}</h2>
        </span>

        <span className="flex justify-center items-center w-10">
          <h3 className="text-sm text-gray-500">{age}</h3>
        </span>

        <span className="flex justify-center items-center w-10">
          <h3 className="text-sm text-gray-500">{area}</h3>
        </span>

        <span className="flex justify-center items-center w-10">
          <h3 className="text-sm text-gray-500">{city}</h3>
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
          className="rounded-md bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={handleStartChatClick}
        >
          התחל שיחה
        </button>
        <button
          className="h-6 w-6 focus:outline-none"
          style={{ background: "transparent", border: "none", padding: 0 }}
          onClick={handleFavoriteClick}
        >
          {isFavorite ? (
            <img src={heartSolid} alt="Favorite" className="h-6 w-6" />
          ) : (
            <img src={HeartRegular} alt="Not Favorite" className="h-6 w-6" />
          )}
        </button>
      </div>
    </div>
  );
};

export default SupporterCard;
