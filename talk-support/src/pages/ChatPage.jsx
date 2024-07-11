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
  resumeChat,
  currentChat,
} from "../redux/features/chatSlice";
import { db } from "../firebase_config";

const ChatPage = () => {
  const [chatDetails, setChatDetails] = useState({
    supporterName: "",
    clientName: "",
  });
  const { messages } = useSelector((store) => store.chat.chat);

  const {
    user: { uid, chats: userChatsArray },
    userType,
  } = useSelector((store) => store.auth);

  const { chats } = useSelector((store) => store.chat);

  const params = useParams();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    if (window.innerWidth > 765) {
      setIsMenuOpen(false);
    } else {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  const mapMassageType = () => {
    if (!messages) return [];
    return messages.map((message) => {
      return {
        ...message,
        type: message.senderId == uid ? "outgoing" : "incoming",
      };
    });
  };

  useEffect(() => {
    if (!params.chatId) return;
    const chat = Object.values(chats).find((chat) => chat.id == params.chatId);
    console.log(params.chatId, chat);
    dispatch(updateChat(chat));
    //dispatch(resumeChat(params.chatId));
    //dispatch(currentChat(params.chatId));
    const unsubscribeChat = onSnapshot(
      doc(db, chatCollection, params.chatId),
      (doc) => {
        if (!doc.exists()) {
          // ?
        } else {
          dispatch(updateChat(doc.data()));
        }
      }
    );

   

    const chatDetails = userChatsArray.find(
      (uc) => uc.chatId === params.chatId
    );
    setChatDetails(chatDetails);

    return () => unsubscribeChat();
  }, [params.chatId]);

  return (
    <>
      <div className="flex h-[91vh] w-screen mt-16">
        <div className="flex-1 flex flex-col">
          <div
            dir="rtl"
            className="max-md:fixed max-md:top-0 max-md:left-0 max-md:right-0"
          >
            <ChatHeader
              contactName={
                userType == "client"
                  ? chatDetails.supporterName
                  : chatDetails.clientName
              }
              isMenuOpen={isMenuOpen}
              handleMenuToggle={handleMenuToggle}
            />
          </div>
          <div className="flex-1 overflow-y-scroll bg-gray-100">
            <ChatMessages messages={mapMassageType()} />
          </div>
          <div className="max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0">
            <ChatInput />
          </div>
        </div>
        <div className="">
          <Sidebar
            isMenuOpen={isMenuOpen}
            handleMenuToggle={handleMenuToggle}
          />
        </div>
      </div>
    </>
  );
};

export default ChatPage;
