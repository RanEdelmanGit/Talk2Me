import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; 
// import { addToFavorites } from "../../redux/features/clientsSlice"; 
import profilePicPlaceholder from "./profile.jpg";
import starSolid from "./star-solid.svg";
import starRegular from "./star-regular.svg";

const SupporterCard = ({
  name,
  location,
  meeting,
  education,
  school,
  profilePic = profilePicPlaceholder, // Default to placeholder if no profilePic is provided
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFavoriteClick = () => {
    console.log('added')
    setIsFavorite(!isFavorite);
    // // Replace 'client_id' with the actual client ID from your state or props
    // const clientId = "client_id"; 
    // dispatch(addToFavorites({ clientId, supporterId }));
  };

  const handleStartChatClick = () => {
    console.log('navigated to chat')
    // Navigate to the chat page with supporterId
    // navigate(`/chat/${supporterId}`);
  };

  return (
    <div
      className="w-full max-w-[380px] p-3 md:p-4 bg-gray-200 rounded-lg shadow-md relative m-2"
      dir="rtl"
    >
      <div className="absolute top-2 left-2">
        <button
          className="h-6 w-6 pt-1 focus:outline-none"
          style={{ background: "transparent", border: "none", padding: 0 }}
          onClick={handleFavoriteClick}
        >
          {isFavorite ? (
            <img src={starSolid} alt="Favorite" className="h-6 w-6" />
          ) : (
            <img src={starRegular} alt="Not Favorite" className="h-6 w-6" />
          )}
        </button>
      </div>
      <div className="flex items-start">
        <div className="flex items-start flex-col">
          <img
            src={profilePic}
            alt="Profile"
            className="size-24 md:size-32 rounded-md"
          />
        </div>
        <div className="mr-4 md:mr-6">
          <div className="text-base md:text-lg font-bold mb-1">{name} </div>
          <div className="text-sm md:text-base">
            <span className="text-sm font-bold">איזור: </span>
            {location}
          </div>
          <div className="text-sm md:text-base">
            <span className="text-sm font-bold border bg-slate-400 rounded-md px-1"> {meeting}</span>
          </div>
          <div className="text-sm md:text-base ">
            <span className="text-sm font-bold">השכלה: </span>
            {education}
          </div>
          <div className="text-sm md:text-base">
            <span className="text-sm font-bold">מוסד לימודים: </span>
            {school}
          </div>
        </div>
      </div>
      <div className="flex justify-start mt-1 md:mt-4">
        <button
          className="bg-blue-500 text-white text-sm py-1.5 px-2 md:py-2 md:px-4 rounded w-24 md:w-32"
          onClick={handleStartChatClick}
        >
          התחל שיחה
        </button>
      </div>
    </div>
  );
};

export default SupporterCard;
