import React, { useState } from "react";
import Login from "../components/auth/Login";
import { Link } from "react-router-dom";

const WelcomePage = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl">
      <div className="p-6 bg-white rounded-lg flex flex-col justify-start min-h-screen">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm md:max-w-2xl">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 mb-6 text-center text-5xl md:text-7xl font-bold leading-9 tracking-tight text-gray-900">
            ברוכים הבאים
          </h2>
          <p className="mt-4 text-center text-xl md:text-2xl tracking-wide leading-relaxed font-semibold">
            פלטפורמה המחברת אנשים המחפשים תמיכה רגשית עם סטודנטים לפסיכולוגיה
            שרוצים להקשיב ולתמוך. בהתנדבות.
          </p>
        </div>

        {isLoginVisible ? (
          <Login setIsLoginVisible={setIsLoginVisible} />
        ) : (
          <div className="space-y-16 max-md:space-y-16 flex flex-col justify-between">
            <div className="flex max-md:flex-col max-md:mx-auto max-md:space-y-4 justify-around mb-2 mt-10">
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
            <div className="flex items-center justify-center flex-col space-y-6">
              <div className="text-center flex">
                <h2 className="pl-2 text-xl font-semibold">יש לך חשבון?</h2>
                <button
                  className="text-xl font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                  onClick={() => setIsLoginVisible(true)}
                >
                  התחבר
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto flex justify-center w-full items-center">
              <div className="flex items-center justify-between md:px-10 w-full">
                <div className="flex text-lg max-md:text-sm">
                <h2 className="pl-2">לפניות ולתמיכה:</h2>
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
