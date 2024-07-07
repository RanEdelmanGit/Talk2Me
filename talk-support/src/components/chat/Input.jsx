import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMassage, saveChat } from "../../redux/features/chatSlice";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const { uid } = useSelector((store) => store.auth.user);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      dispatch(addMassage({ text: message, senderId: uid }));
      dispatch(saveChat());
      setMessage("");
    }
  };

  return (
    <footer className="bg-white border-t border-gray-300 p-4 max-md:fixed max-md:bottom-2 max-md:left-0 max-md:right-0">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="הקלד הודעה ..."
          className="w-full px-3 py-1.5 rounded-md border border-gray-400 focus:outline-none focus:indigo-500"
          dir="rtl"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="bg-indigo-500 text-white p-2 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>
        </button>
      </form>
    </footer>
  );
};

export default ChatInput;
