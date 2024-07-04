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
    <footer className="bg-white border-t border-gray-300 p-4">
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2"
        >
          Send
        </button>
      </form>
    </footer>
  );
};

export default ChatInput;
