import React, { useRef } from 'react';


const FileInput = ({text, file}) => {

  return (
    <div className=" flex justify-between items-center pr-2 w-full h-12 bg-white border border-gray-300 rounded-lg">
    <p className="opacity-75 font-semibold">{file ? file.name : text}</p>

    <div className={`w-[20%] h-full flex justify-center items-center ${file ? 'bg-green-200' : 'bg-gray-200 hover:bg-gray-400'} rounded-l-lg`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
        />
      </svg>
    </div>
  </div>
  );
};

export default FileInput;
