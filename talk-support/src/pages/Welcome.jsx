import React, { useState } from "react";
import Login from "../components/auth/Login";
import { Link } from "react-router-dom";
import { texts } from '../constants/texts';

const WelcomePage = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(false);

  return (
    <div
      className="min-h-screen flex items-center justify-center pt-10 md:pt-16"
      dir="rtl"
    >
      <div className="p-6 bg-white rounded-lg flex flex-col justify-start min-h-screen">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm md:max-w-2xl">
          <h2 className="mb-6 text-center text-5xl md:text-7xl font-semibold leading-9 tracking-tight text-gray-900">
            {texts.Welcome.title}
          </h2>
          <p className="mt-4 text-center text-xl md:text-2xl tracking-wide leading-relaxed">
            {texts.Welcome.description}
          </p>
        </div>

        {isLoginVisible ? (
          <Login setIsLoginVisible={setIsLoginVisible} />
        ) : (
          <div className="space-y-12 md:space-y-16 flex flex-col justify-between pb-4">
            <div className="flex max-md:flex-col max-md:mx-auto max-md:space-y-4 justify-around mb-2 mt-10 md:mt-24">
              <Link
                to="/register/supporter"
                className="btn btn-wide bg-indigo-500 hover:bg-indigo-300 opacity-90 text-xl text-white mx-2"
              >
                {texts.Welcome.supporterButton}
              </Link>
              <Link
                to="/register/client"
                className="btn btn-wide bg-indigo-500 hover:bg-indigo-300 opacity-90 text-xl text-white mx-2"
              >
                {texts.Welcome.clientButton}
              </Link>
            </div>

            <div className="text-center flex items-center justify-center gap-2 ">
              <h2 className="text-xl font-semibold">{texts.Welcome.hasAccount}</h2>
              <button
                className="text-xl font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                onClick={() => setIsLoginVisible(true)}
              >
                {texts.Welcome.loginButton}
              </button>
            </div>
          </div>
        )}

        <div className="fixed bottom-4 left-0 right-0 pt-4 md:mt-auto flex justify-center w-full items-center">
          <div className="flex items-center justify-around w-full md:w-[50%]">
            <div className="flex text-lg max-md:text-base">
              <h2 className="pl-2">{texts.Welcome.contactPrompt}</h2>
              <Link
                to="/contact"
                className="text-blue-500 font-semibold underline"
              >
                {texts.Welcome.contactLink}
              </Link>
            </div>
            <button
              className="bg-slate-500 text-white px-2 md:px-4 py-1 md:py-2 rounded max-md:text-base"
              onClick={() =>
                window.open(
                  "https://www.nafshi.info/?gad_source=1&gclid=CjwKCAjw4f6zBhBVEiwATEHFVksjVfWBlmzoFq5zStUbxpFrmTrOuV6IMYVJx9fYzkUKtw-P0mDjFxoCUGAQAvD_BwE",
                  "_blank"
                )
              }
            >
              {texts.Welcome.helpResources}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
