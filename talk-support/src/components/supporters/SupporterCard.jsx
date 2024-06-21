import React, { useState } from "react";
import profilePicPlaceholder from "./profile.jpg";
import starSolid from "./star-solid.svg"; 
import starRegular from "./star-regular.svg"; 

const SupporterCard = ({
  email,
  fullName,
  phone,
  area,
  meeting,
  education,
  school,
  profilePic = profilePicPlaceholder, // Default to placeholder if no profilePic is provided
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div
      className="w-full max-w-lg p-3 md:p-4 bg-gray-200 rounded-lg shadow-md relative"
      dir="rtl"
    >
      <div className="absolute top-2 left-2">
        <button
          className="h-6 w-6 pt-1 focus:outline-none"
          style={{ background: 'transparent', border: 'none', padding: 0 }}
          onClick={handleFavoriteClick}
        >
          {isFavorite ? (
            <img
              src={starSolid}
              alt="Favorite"
              className="h-6 w-6"
            />
          ) : (
            <img
              src={starRegular}
              alt="Not Favorite"
              className="h-6 w-6"
            />
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
          <div className="text-base md:text-lg font-bold mb-1 text-black">פגי גו </div>
          <div className="text-sm md:text-base text-black">
            <span className="text-sm font-bold text-black">איזור: </span>הרצליה
          </div>
          <div className="text-sm md:text-base text-black">
            <span className="text-sm font-bold text-black">אופן המפגש: </span>
            {"[גם וגם]"}
          </div>
          <div className="text-sm md:text-base text-black">
            <span className="text-sm font-bold text-black">השכלה: </span>תואר שלישי
          </div>
          <div className="text-sm md:text-base text-black">
            <span className="text-sm font-bold text-black">מוסד לימודים: </span>אונ' תל אביב
          </div>
        </div>
      </div>
      <div className="flex justify-start mt-1 md:mt-4">
        <button className="bg-blue-500 text-white text-sm py-1.5 px-2 md:py-2 md:px-4 rounded w-24 md:w-32">
          התחל שיחה
        </button>
      </div>
    </div>
  );
};

export default SupporterCard;
