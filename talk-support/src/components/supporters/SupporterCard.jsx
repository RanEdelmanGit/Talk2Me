import React from "react";
import profilePicPlaceholder from "./profile.jpg";

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
  return (
    <div
      className="w-full max-w-lg p-3 md:p-4 bg-gray-200 rounded-lg shadow-md relative"
      dir="rtl"
    >
      <div className="flex items-start">
        <div className="flex items-start flex-col bg-gray-200">
          <img
            src={profilePic}
            alt="Profile"
            className="size-24 md:size-32 rounded-md"
          />
        </div>
        <div className="mr-4 md:mr-6">
            <div className="text-base md:text-lg font-bold mb-2">פגי גו </div>
          <div className="text-sm md:text-base">
            <span className="text-sm font-bold">איזור: </span>הרצליה
          </div>
          <div className="text-sm md:text-base">
            <span className="text-sm font-bold">אופן המפגש: </span>
            {"[גם וגם]"}
          </div>
          <div className="text-sm md:text-base">
            <span className="text-sm md:text font-bold">השכלה: </span>תואר שלישי
          </div>
          <div className="text-sm md:text-base">
            <span className="text-sm font-bold">מוסד לימודים: </span>אונ' תל אביב
          </div>
        </div>
      </div>
      <div className="flex justify-start mt-1 md:mt-4">
        <button className="bg-blue-500 text-white text-sm  py-1.5 px-2 md:py-2 md:px-4 rounded w-24 md:w-32">
          התחל שיחה
        </button>
      </div>
    </div>
  );
};

export default SupporterCard;
