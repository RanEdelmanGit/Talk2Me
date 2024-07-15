import React, { useState } from "react";
import { useSelector } from "react-redux";
import SupporterCard from "./SupporterCard";
import colors from "../../constants/profileColors"; // Import the colors array

export default function SupporterList({ supporters }) {
  const [openAboutIndex, setOpenAboutIndex] = useState(null);
  const status = useSelector((state) => state.supporters.status);

  const toggleAbout = (index) => {
    setOpenAboutIndex(openAboutIndex === index ? null : index);
  };

  return (
    <div className="flex-1 w-[92%] mx-auto flex flex-col overflow-y-auto safe-bottom">
      {supporters.length === 0 ? (
        <h2 className="text-center text-gray-500 mt-4 text-xl">
          {status === "loading" ? "טוען תומכים..." : "לא נמצאו תומכים"}
        </h2>
      ) : (
        supporters.map((supporter, index) => (
          <SupporterCard
            key={index}
            supporter={supporter}
            aboutOpen={openAboutIndex === index}
            toggleAbout={() => toggleAbout(index)}
            color={colors[index % colors.length]} // Cycle through colors using modulus operator
          />
        ))
      )}
    </div>
  );
}
