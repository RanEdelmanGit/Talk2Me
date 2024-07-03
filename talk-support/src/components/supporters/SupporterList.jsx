import React from "react";
import SupporterCard from "./SupporterCard";

export default function SupporterList({ supporters }) {

 
  return (
    <>
    {/* <div className="w-full mx-auto md:p-4 border-y border-gray-400 h-16">
      <div className="w-[92%] mx-auto  px-10 flex items-center justify-around">
      <span className=""></span>
      <span className=" text-xl font-bold">שם</span>
      <span className="text-xl font-bold">גיל</span>
      <span className="text-xl font-bold">מפגש</span>
      <span className="text-xl font-bold">איזור</span>
      <span className="text-xl font-bold">עיר</span>
      <span className=""></span>
      <span className="w-6"></span>
      </div>
    </div> */}
      <div className="h-full mx-auto w-[92%] flex flex-wrap justify-start ">
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
