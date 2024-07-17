import React from "react";
import ContactForm from "../components/contact/ContactForm";
import ContactInfo from "../components/contact/ContactInfo";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Contact() {
  const {isAuth} = useSelector((state) => state.auth);

  return (
    <div className="relative flex max-md:flex-col h-screen overflow-y-auto pb-19" dir="rtl">
      <Link
        to={isAuth ? "/" : "/welcome"}
        className="absolute top-4 left-4 m-4 text-base font-semibold text-gray-900"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
          />
        </svg>
      </Link>
      <div className="flex-1 mt-16 sm:mt-24">
        <ContactInfo />
      </div>
      <div className="flex-1 mt-16 sm:mt-24 pb-10 ">
        <ContactForm />
      </div>
    </div>
  );
}
