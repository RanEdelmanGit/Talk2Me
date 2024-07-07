import React, { useState, useEffect } from "react";
import Sidebar from "../components/chat/SideBar";
import ChatHeader from "../components/chat/ChatHeader";
import ChatMessages from "../components/chat/Messages";
import ChatInput from "../components/chat/Input";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import {
  updateChat,
  chatCollection,
} from "../redux/features/chatSlice";
import { db } from "../firebase_config";

const ChatPage = () => {
  const { massages } = useSelector((store) => store.chat.chat);
  const { uid } = useSelector((store) => store.auth.user);
  const params = useParams();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(window.innerWidth < 640);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const mapMassageType = () => {
    if (!massages) return [];
    return massages.map((massage) => {
      return {
        ...massage,
        type: massage.senderId == uid ? "outgoing" : "incoming",
      };
    });
  };

  useEffect(() => {
    if (!params.chatId) return;

    const unsubscribe = onSnapshot(
      doc(db, chatCollection, params.chatId),
      (doc) => {
        if (!doc.exists()) {
          // ?
        } else {
          dispatch(updateChat(doc.data()));
        }
      }
    );

    return () => unsubscribe();
  }, [params, dispatch]);



  return (
    <div className="flex h-[91vh] w-screen mt-16">
        <div className="flex-1 flex flex-col">
          <div dir="rtl">
            <ChatHeader contactName="אליס"
            isMenuOpen={isMenuOpen}
            handleMenuToggle={handleMenuToggle} />
          </div>
          <div className="overflow-y-scroll flex-1 bg-gray-100">
            <ChatMessages messages={mapMassageType()} />
          </div>
          <ChatInput />
        </div>
        <div className="">
      <Sidebar isMenuOpen={isMenuOpen} handleMenuToggle={handleMenuToggle} />
      </div>
    </div>
  );
};

export default ChatPage;
