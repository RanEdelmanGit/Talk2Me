import React, { useState } from "react";
import Login from "../components/auth/Login";
import { Link } from "react-router-dom";
import { texts } from '../constants/texts';

const WelcomePage = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(false);

  return (
    <div className="min-h-screen flex justify-center bg-white" dir="rtl">
      <div className="w-full h-svh max-w-4xl p-6 bg-white flex flex-col justify-between">
        <div className="flex-grow flex flex-col justify-start mt-10 sm:mt-16">
          <div className="text-center mb-12">
            <h2 className="text-5xl sm:text-6xl  font-semibold text-gray-900 mb-6">
              {texts.Welcome.title}
            </h2>
            <p className="text-xl sm:text-2xl sm:px-10 text-gray-600">
              {texts.Welcome.description}
            </p>
          </div>

          {isLoginVisible ? (
            <Login setIsLoginVisible={setIsLoginVisible} />
          ) : (
            <div className="space-y-12">
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 sm:gap-4">
                <Link
                  to="/register/supporter"
                  className="w-full btn sm:btn-wide bg-indigo-500 hover:bg-indigo-600 text-xl text-white rounded-lg transition-colors duration-300"
                >
                  {texts.Welcome.supporterButton}
                </Link>
                <Link
                  to="/register/client"
                  className="w-full btn sm:btn-wide bg-indigo-500 hover:bg-indigo-600 text-xl text-white rounded-lg transition-colors duration-300"
                >
                  {texts.Welcome.clientButton}
                </Link>
              </div>

              <div className="text-center">
                <h2 className="text-xl font-semibold inline-block">{texts.Welcome.hasAccount}</h2>
                <button
                  className="text-xl font-semibold text-indigo-600 hover:text-indigo-500 mr-2 transition-colors duration-300"
                  onClick={() => setIsLoginVisible(true)}
                >
                  {texts.Welcome.loginButton}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 flex sm:flex-row justify-between items-center sm:space-y-0 sm:px-4">
          <div className="flex items-center space-x-2 text-sm sm:text-lg">
            <h2>{texts.Welcome.contactPrompt}</h2>
            <Link
              to="/contact"
              className="text-blue-500 hover:text-blue-600 font-semibold underline transition-colors duration-300"
            >
              {texts.Welcome.contactLink}
            </Link>
          </div>
          <button
            className="bg-slate-400 hover:bg-slate-500 text-white px-4 py-2 rounded transition-colors duration-300 text-sm sm:text-lg"
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
  );
};

export default WelcomePage;