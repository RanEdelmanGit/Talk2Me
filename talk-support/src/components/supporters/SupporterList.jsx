import React from "react";
import SupporterCard from "./SupporterCard";

export default function SupporterList({ supporters }) {
  return (
    <>
      <div className="max-h-[71vh] md:max-h-[90vh] mx-auto w-[92%] flex flex-col overflow-y-auto">
        {supporters.map((supporter, index) => (
          <SupporterCard key={index} supporter={supporter} />
        ))}
      </div>
    </>
  );
}
