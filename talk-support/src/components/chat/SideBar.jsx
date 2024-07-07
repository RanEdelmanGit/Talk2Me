import React, { useEffect } from "react";
import Chats from "./Chats";
import Header from "../layout/Header";
import { useDispatch, useSelector } from "react-redux";
import { loadChats } from "../../redux/features/chatSlice";

const Sidebar = ({ isMenuOpen, handleMenuToggle }) => {
  const { chats } = useSelector((store) => store.chat);
  const userChats = useSelector((store) => store.auth.user.chats);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadChats({ userChats }));
  }, []);

  return (
    <div>
      {/* Sidebar */}
      <div
        className={`${
          isMenuOpen
            ? "fixed top-0 md:top-16 right-0 max-md:w-full h-full"
            : "hidden md:block"
        } bg-white z-40`}
      >
        <Header />
        <header
          className="p-4 border-b max-md:mt-16 border-gray-300 flex justify-between items-center bg-gray-200"
          dir="rtl"
        >
          <h1 className="text-2xl font-semibold">שיחות</h1>
          {/* Close button in header */}
          <input
            type="search"
            className="rounded-lg h-8 border-gray-300 focus:ring-indigo-500"
            placeholder="חפש לפי שם ..."
          />
        </header>
        <div
          className="overflow-auto h-[83vh] max-md:h-[73vh] mb-9 pb-5 border-l border-gray-300"
          dir="rtl"
        >
          {[
            {
              name: "אליס",
              message: "יששש!!",
              color: "ffa8e4",
              chatId:
                "xwOsupvBN3UTc0uHKmfRKeY13aa2GInubgcAXUbiZKu4iJhdULX1r9h1",
            },
            {
              name: "מרטין",
              message: "המקום לפיצה היה מדהים!",
              color: "ad922e",
              chatId:
                "xwOsupvBN3UTc0uHKmfRKeY13aa2GInubgcAXUbiZKu4iJhdULX1r9h1",
            },
            {
              name: "דניאלה",
              message: "הצלחתי לסיים את הפרויקט!",
              color: "34a8e4",
            },
            {
              name: "יוסי",
              message: "נפגשנו בבית הקפה והיה מצוין.",
              color: "b9225e",
            },
            {
              name: "ליאת",
              message: "השיעור היה ממש מעניין!",
              color: "ef128e",
            },
            {
              name: "אורן",
              message: "ראיתי סרט נהדר אתמול.",
              color: "12ad9e",
            },
            {
              name: "מירב",
              message: "מצאתי מתכון חדש לניסוי!",
              color: "d4a8e4",
            },
            {
              name: "דוד",
              message: "הטיול ליער היה כיף!",
              color: "ad123e",
            },
            {
              name: "נועה",
              message: "קניתי ספר חדש והוא מעולה.",
              color: "ffa1e4",
            },
            {
              name: "אבי",
              message: "המסעדה הייתה ממש מוצלחת.",
              color: "ad7e2e",
            },
          ].map((contact, index) => (
            <div key={index} className="border-b border-gray-200">
              <Chats contact={contact} handleMenuToggle={handleMenuToggle} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
