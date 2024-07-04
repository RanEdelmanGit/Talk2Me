import React, { useState, useEffect } from "react";
import Sidebar from "../components/chat/SideBar";
import ChatHeader from "../components/chat/ChatHeader";
import ChatMessages from "../components/chat/Messages";
import ChatInput from "../components/chat/Input";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { doc, onSnapshot, getFirestore } from "firebase/firestore";
import {
  updateChat,
  startChat,
  chatCollection,
} from "../redux/features/chatSlice";

const ChatPage = () => {
  const { massages } = useSelector((store) => store.chat.chat);
  const { uid } = useSelector((store) => store.auth.user);
  const { userType } = useSelector((store) => store.auth);
  const params = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    if (params.chatId) {
      const db = getFirestore();
      console.log("here 1", params);

      const unsubscribe = onSnapshot(
        doc(db, chatCollection, params.chatId),
        (doc) => {
          console.log("params", params);
          if (!doc.exists()) {
            console.log("does not exists");
          } else {
            console.log("here", doc.data());
            dispatch(updateChat(doc.data()));
          }
        }
      );
      //return unsubscribe();
    }
  }, [params]);

  return (
    <div className="flex h-[91vh] w-screen mt-16">
      <Sidebar isMenuOpen={isMenuOpen} handleMenuToggle={handleMenuToggle} />
      <div className="flex-1 flex flex-col ">
        <ChatHeader contactName="Alice" />
        <div className="overflow-y-scroll flex-1">
          <ChatMessages messages={mapMassageType()} />
        </div>
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatPage;
