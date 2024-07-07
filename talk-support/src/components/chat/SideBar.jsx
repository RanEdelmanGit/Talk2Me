import React, { useEffect } from "react";
import Chats from "./Chats";
import Header from "../layout/Header";
import { useDispatch, useSelector } from "react-redux";
import { loadChats } from "../../redux/features/chatSlice";
import colors from "../../profileColors";


const Sidebar = ({ isMenuOpen, handleMenuToggle }) => {
  const { chats } = useSelector((store) => store.chat);
  const userChats = useSelector((store) => store.auth.user.chats);
  const { userType, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadChats({ userChats }));
  }, []);

  const contacts = [
    { name: "אליס", message: "יששש!!", chatId: "1" },
    { name: "מרטין", message: "המקום לפיצה היה מדהים!", chatId: "2" },
    { name: "דניאלה", message: "הצלחתי לסיים את הפרויקט!", chatId: "3" },
    { name: "יוסי", message: "נפגשנו בבית הקפה והיה מצוין.", chatId: "4" },
    { name: "ליאת", message: "השיעור היה ממש מעניין!", chatId: "5" },
    { name: "אורן", message: "ראיתי סרט נהדר אתמול.", chatId: "6" },
    { name: "מירב", message: "מצאתי מתכון חדש לניסוי!", chatId: "7" },
    { name: "דוד", message: "הטיול ליער היה כיף!", chatId: "8" },
    { name: "נועה", message: "קניתי ספר חדש והוא מעולה.", chatId: "9" },
    { name: "אבי", message: "המסעדה הייתה ממש מוצלחת.", chatId: "10" },
  ];

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
         {user.uid && <Header user={user} userType={userType} />}
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
          {contacts.map((contact, index) => (
            <div key={index} className="border-b border-gray-200">
              <Chats
                contact={{
                  ...contact,
                  color: colors[index % colors.length],
                }}
                handleMenuToggle={handleMenuToggle}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
