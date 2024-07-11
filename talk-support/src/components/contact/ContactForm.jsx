import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase_config"; // Make sure to import your firebase_config

export default function ContactForm({ isAuth, userType }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Form validation
    if (!formData.email || !formData.phone || !formData.subject || !formData.message) {
      setError("Email, phone, subject and message are required.");
      return;
    }

    let collectionName = "inquiries";
    if (isAuth) {
      collectionName = userType === "client" ? "clientInquiries" : "supporterInquiries";
    }

    try {
      await addDoc(collection(db, collectionName), formData);
      setSuccess("Your message has been sent successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      setError("Error sending message. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl px-8 max-md:pb-56" dir="rtl">
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-semibold leading-6 text-gray-900">
            שם פרטי
          </label>
          <div className="mt-2.5">
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              autoComplete="given-name"
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-semibold leading-6 text-gray-900">
            שם משפחה
          </label>
          <div className="mt-2.5">
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              autoComplete="family-name"
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
            אימייל
          </label>
          <div className="mt-2.5">
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="phone" className="block text-sm font-semibold leading-6 text-gray-900">
            מספר טלפון
          </label>
          <div className="mt-2.5">
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="subject" className="block text-sm font-semibold leading-6 text-gray-900">
            נושא
          </label>
          <div className="mt-2.5">
            <input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              autoComplete="subject"
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
            הודעה
          </label>
          <div className="mt-2.5">
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
      <div className="mt-10">
        <button
          type="submit"
          className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          בוא נדבר
        </button>
      </div>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {success && <p className="mt-4 text-green-500">{success}</p>}
    </form>
  );
}
