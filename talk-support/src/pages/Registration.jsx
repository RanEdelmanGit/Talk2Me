import React, { useState } from "react";
import SupporterRegistration from "../components/auth/SupporterRegistration";
import ClientRegistration from "../components/auth/ClientRegistration";
import "../styles/registrationPage.css";

const RegistrationPage = () => {
  const [isSupporter, setIsSupporter] = useState(true);

  return (
    <div className="flex items-center justify-center" dir="rtl">
      <div className="">
        <div className=" flex toggle-buttons mb-4">
          <button
            className={`toggle-button ${isSupporter ? "active bg-slate-400" : ""}`}
            onClick={() => setIsSupporter(true)}
          >
            הרשמת מאזין
          </button>
          <button
            className={`toggle-button ${!isSupporter ? "active bg-slate-400" : ""}`}
            onClick={() => setIsSupporter(false)}
          >
            הרשמת לקוח
          </button>
        </div>
        {isSupporter ? <SupporterRegistration /> : <ClientRegistration />}
      </div>
    </div>
  );
};

export default RegistrationPage;
