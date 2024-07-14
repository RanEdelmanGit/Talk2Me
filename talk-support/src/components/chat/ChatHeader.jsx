import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleVisibility, saveChat } from "../../redux/features/chatSlice";
import Modal from "../common/Modal";
import EyeIcon from "../../assets/svgs/EyeIcon";
import EyeOffIcon from "../../assets/svgs/EyeOffIcon";

const ChatHeader = ({ contactName, isMenuOpen, handleMenuToggle }) => {
  const dispatch = useDispatch();
  const { isVisible, id } = useSelector((store) => store.chat.chat);
  const { userType, user } = useSelector((store) => store.auth);
  const [showModal, setShowModal] = useState(false);

  const handleVisibility = () => {
    const nickName = user.nickname;
    const fullName = `${user.firstName} ${user.lastName}`;
    dispatch(toggleVisibility({ nickName, fullName }));
    dispatch(saveChat());
    setShowModal(false);
  };

  return (
    <header className="bg-white px-2 max-md:py-4 md:p-4 text-gray-700 border-b flex justify-between items-center">
      <h1 className="text-2xl font-semibold max-md:pr-4">{contactName}</h1>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        {/* todo - design modal */}
        <div className="space-y-4">
          <p className="text-xl pr-4">{isVisible ? `חזור למצב אנונימי עם  ${contactName}?`: `שתף פרטים עם ${contactName}?`}</p>
          <div className="flex justify-end items-end gap-4">
            <button className="py-1 px-2 flex justify-center items-center bg-green-200 rounded-md" onClick={handleVisibility}>אשר</button>
            <button className="py-1 px-2 flex justify-center items-center bg-red-200 rounded-md" onClick={() => setShowModal(false)}>בטל</button>
          </div>
        </div>
      </Modal>
      {userType === "client" && (
        <button onClick={() => setShowModal(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            {isVisible ? (
              <EyeIcon/>
            ) : (
              <EyeOffIcon/>
            )}
          </svg>
        </button>
      )}
      <button
        className="md:hidden p-2 text-black rounded"
        onClick={handleMenuToggle}
      >
        {isMenuOpen ? (
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
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        ) : (
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
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        )}
      </button>
    </header>
  );
};

export default ChatHeader;
