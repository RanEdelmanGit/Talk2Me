import React, { useState } from "react";
import Login from "../components/auth/Login";
import { Link } from "react-router-dom";

const WelcomePage = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl">
      <div className="p-6 bg-white rounded-lg flex flex-col justify-start min-h-screen">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm md:max-w-2xl">
          <h2 className="mt-12 mb-6 text-center text-5xl md:text-7xl font-semibold leading-9 tracking-tight text-gray-900">
            ברוכים הבאים
          </h2>
          <p className="mt-4 text-center text-xl md:text-2xl tracking-wide leading-relaxed">
            פלטפורמה המחברת אנשים המחפשים תמיכה רגשית עם סטודנטים לפסיכולוגיה
            שרוצים להקשיב ולתמוך. בהתנדבות.
          </p>
        </div>

        {isLoginVisible ? (
          <Login setIsLoginVisible={setIsLoginVisible} />
        ) : (
          <div className="space-y-12 md:space-y-16 flex flex-col justify-between pb-4">
            <div className="flex max-md:flex-col max-md:mx-auto max-md:space-y-4 justify-around mb-2 mt-10 md:mt-24">
              <Link
                to="/register/supporter"
                className="btn btn-wide bg-indigo-500 hover:bg-indigo-300 opacity-90 text-base text-white mx-2"
              >
                באתי להקשיב
              </Link>
              <Link
                to="/register/client"
                className="btn btn-wide bg-indigo-500 hover:bg-indigo-300 opacity-90 text-base text-white mx-2"
              >
                באתי לשתף
              </Link>
            </div>

            <div className="text-center flex items-center justify-center gap-2">
              <h2 className="text-xl font-semibold">יש לך חשבון?</h2>
              <button
                className="text-xl font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                onClick={() => setIsLoginVisible(true)}
              >
                התחבר
              </button>
            </div>
          </div>
        )}

        <div className="fixed bottom-4 left-0 right-0 pt-4 md:mt-auto flex justify-center w-full items-center">
          <div className="flex items-center justify-around md:px-96 w-full">
            <div className="flex text-lg max-md:text-sm">
              <h2 className="pl-2">לפניות ושאלות:</h2>
              <button className="text-blue-500 font-semibold underline">
                צור איתנו קשר
              </button>
            </div>
            <button
              className="bg-slate-500 text-white px-2 md:px-4 py-1 md:py-2 rounded max-md:text-sm"
              onClick={() =>
                window.open(
                  "https://www.nafshi.info/?gad_source=1&gclid=CjwKCAjw4f6zBhBVEiwATEHFVksjVfWBlmzoFq5zStUbxpFrmTrOuV6IMYVJx9fYzkUKtw-P0mDjFxoCUGAQAvD_BwE",
                  "_blank"
                )
              }
            >
              עזרה ומשאבים
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
