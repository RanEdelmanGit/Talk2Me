import React, { useState } from "react";
import Login from "../components/auth/Login";
import Modal from "../components/common/Modal";
import Contact from "../components/Contact";
import ClientRegistration from '../components/auth/ClientRegistration';
import SupporterRegistration from '../components/auth/SupporterRegistration'

const Welcome = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const handleOpenModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center" dir="rtl">
      <div className="p-6 bg-white rounded-lg flex flex-col justify-start min-h-screen">
          <div className="space-y-16 flex flex-col justify-between">
            <h2 className="text-center text-4xl font-bold mb-2 mt-14">ברוכים הבאים </h2>
            <p className="text-center mb-6 text-xl tracking-wide leading-relaxed font-semibold">
              פלטפורמה המחברת אנשים המחפשים תמיכה רגשית עם סטודנטים לפסיכולוגיה שרוצים להקשיב ולתמוך. בהתנדבות.
            </p>
            <div className="flex justify-around mb-2">
              <button className="bg-green-500 text-white px-4 py-2 rounded"  onClick={() => handleOpenModal(<ClientRegistration />)}>הירשם כנתמך</button>
              <button className="bg-green-200 text-green-700 px-4 py-2 rounded"  onClick={() => handleOpenModal(<SupporterRegistration />)}>הירשם כתומך</button>
            </div>
            <div className="flex items-center justify-center flex-col space-y-6">
                <div className="text-center">
                    <h2>יש לך חשבון?</h2>
            <button
              className="text-blue-500 text-lg font-semibold underline"
              onClick={() => handleOpenModal(<Login />)}
            >
              התחבר
            </button>
            </div>
            <div className="text-center">
                <h2>לפניות ולתמיכה:</h2>
              <button
              className="text-blue-500 text-lg font-semibold underline"
              onClick={() => handleOpenModal(<Contact/>)}
            >
              צור איתנו קשר
            </button>
            </div>
            </div>
          </div>
        <div className="mt-auto">
          <div className="text-center mb-2 leading-relaxed font-semibold">
            <p>
            אם אתם זקוקים לעזרה מיידית, לחצו על הכפתור למטה לצפייה במשאבים זמינים.
            </p>
          </div>
          <div className="text-center mb-6">
            <button
              className="bg-orange-500 text-white px-4 py-2 rounded"
              onClick={() =>
                window.open(
                  "https://www.nafshi.info/?gad_source=1&gclid=CjwKCAjw4f6zBhBVEiwATEHFVksjVfWBlmzoFq5zStUbxpFrmTrOuV6IMYVJx9fYzkUKtw-P0mDjFxoCUGAQAvD_BwE",
                  "_blank"
                )
              }
            >
              עזרה ומשאבים{" "}
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default Welcome;
