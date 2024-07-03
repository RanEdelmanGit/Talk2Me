import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  addFavorite,
  removeFavorite,
  updateUser,
} from "../../redux/features/authSlice";

import profilePicPlaceholder from "./profile.jpg";
import heartSolid from './heart-solid.svg';
import HeartRegular from './heart-regular.svg';
import store from "../../redux/store";

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
    navigate(`/chat/${uid}`);
  };

  return (
    <div
      className="w-full mx-auto md:p-4 border-y border-gray-200"
      dir="rtl"
    >
      <div className="flex items-center justify-between w-full px-10">
      <img src={profilePic} alt="Profile" className="w-16 h-16 rounded-full" />

      <span className="w-32 h-8 overflow-hidden text-ellipsis whitespace-nowrap">
        <h2 className="text-lg font-bold">{name}</h2>
      </span>

      <span className="flex justify-center items-center w-10">
        <h3 className="text-sm text-gray-500">{age}</h3>
      </span>

      <span className="flex justify-center items-center w-40">
        <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
          {meeting}
        </span>
      </span>

      <span className="flex justify-center items-center w-10">
        <h3 className="text-sm text-gray-500">{area}</h3>
      </span>

      <span className="flex justify-center items-center w-10">
        <h3 className="text-sm text-gray-500">{city}</h3>
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
