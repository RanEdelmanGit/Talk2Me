import React from "react";
import SupporterCard from "./SupporterCard";

export default function SupporterList({ supporters }) {

 
  return (
    <>
      <div className="h-full flex flex-wrap justify-start mx-auto">
        {supporters.map((supporter, index) => (
          <SupporterCard
            key={index}
            supporter={supporter}
          />
        ))}
      </div>
    </>
  );
}
