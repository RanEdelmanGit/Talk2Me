import React, { useState } from "react";
import SupporterCard from "./SupporterCard";
import colors from "../../constants/profileColors"; // Import the colors array

export default function SupporterList({ supporters }) {
  const [openAboutIndex, setOpenAboutIndex] = useState(null);

  const toggleAbout = (index) => {
    setOpenAboutIndex(openAboutIndex === index ? null : index);
  };

  return (
    <div className="max-h-[71vh] md:max-h-[90vh] mx-auto w-[92%] flex flex-col overflow-y-auto">
      {supporters.length === 0 ? (
        <h2 className="text-center text-gray-500 mt-4 text-xl">
          לא נמצאו תומכים
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
