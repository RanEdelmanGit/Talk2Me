import React, { useState, useRef } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase_config";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setFormDetails,
  setUserType,
  phoneCall,
  meetingOffline,
  meetingOnline,
  userTypeSupporter,
  setUid,
} from "../redux/features/authSlice";
import FileInput from "../components/common/FileInput";
import Loading from "../components/common/Loading";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Field, Label, Switch } from "@headlessui/react";
import { cities } from "../cities";

const SupporterRegistration = () => {
  const [error, setError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [charCount, setCharCount] = useState(200);
  const navigate = useNavigate();
  const { status } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const resumeRef = useRef(null);
  const studentApprovalRef = useRef(null);

  const handleClick = (ref) => {
    ref.current.click();
  };

  const handleBadgeClick = (value) => {
    setRegistration((prevState) => {
      const { meeting } = prevState;
      if (meeting.includes(value)) {
        return {
          ...prevState,
          meeting: meeting.filter((v) => v !== value),
        };
      } else {
        return {
          ...prevState,
          meeting: [...meeting, value],
        };
      }
    });
  };

  const handleChange = ({ target }) => {
    const key = target.id;
    const value = target.value;

    if (key === "meeting") {
      const options = target.options;
      const selectedValues = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selectedValues.push(options[i].value);
        }
      }
      setRegistration({ ...registration, [key]: selectedValues });
    } else if (key === "birthYear") {
      const currentYear = new Date().getFullYear();
      const calculatedAge = currentYear - value;
      if (calculatedAge >= 18) {
        setRegistration({ ...registration, [key]: value, age: calculatedAge });
      }
    } else {
      setRegistration({ ...registration, [key]: value });
    }
    if (key === "about") {
      setCharCount(200 - value.length); // Update character count
    }
  };

  const [registration, setRegistration] = useState({
    email: "",
    phone: "",
    password: "",
    firstName: "",
    lastName: "",
    meeting: [],
    gender: "not-selected",
    age: 18,
    birthYear: "not-selected",
    city: null,
    address: "",
    area: "not-selected",
    referralSource: "not-selected",
    preferredLanguage: "hebrew",
    approved: false,
    resume: "",
    studentApproval: "",
    about: "",
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.id;
    setRegistration((prev) => ({ ...prev, [fieldName]: file }));
  };

  const uploadFile = async (file, filePath) => {
    const fileRef = storageRef(storage, filePath);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const requiredFields = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "password", label: "Password" },
    { key: "birthYear", label: "Birth Year" },
    { key: "gender", label: "Gender" },
    { key: "area", label: "Area" },
    { key: "city", label: "City" },
    { key: "address", label: "Address" },
    { key: "referralSource", label: "Referral Source" },
    { key: "preferredLanguage", label: "Language" },
    { key: "meeting", label: "Meeting Preference" },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!agreed) {
      setError("You must agree to the terms and conditions to register.");
      return;
    }

    if (!validateEmail(registration.email)) {
      setError("Invalid email format.");
      return;
    }

    if (!validatePhone(registration.phone)) {
      setError("Invalid phone format. Please enter a 10-digit phone number.");
      return;
    }

    // Validation for required fields
    for (let field of requiredFields) {
      if (
        registration[field.key] === "not-selected" ||
        registration[field.key] === "" ||
        registration[field.key] === null ||
        (Array.isArray(registration[field.key]) &&
          registration[field.key].length === 0)
      ) {
        setError(`Please select a valid option for ${field.label}`);
        return;
      }
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registration.email,
        registration.password
      );
      const userId = userCredential.user.uid;

      await updateProfile(userCredential.user, {
        displayName: registration.firstName + " " + registration.lastName,
      });

      const user = { ...registration, uid: userId };

      if (user.resume) {
        const resumeURL = await uploadFile(
          user.resume,
          `supporters/${userId}/resume`
        );
        user.resume = resumeURL;
      }
      if (user.studentApproval) {
        const studentApprovalURL = await uploadFile(
          user.studentApproval,
          `supporters/${userId}/studentApproval`
        );
        user.studentApproval = studentApprovalURL;
      }

      user.chats = [];
      user.approved = false;
      await setDoc(doc(db, "supporters", userId), user);

      dispatch(setUserType(userTypeSupporter));
      dispatch(setFormDetails(user));
      dispatch(setUid(userId));
      localStorage.setItem("userType", userTypeSupporter);
      navigate("/");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("Email already exists");
      } else if (error.code === "invalid-argument") {
        setError("Missing data");
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen" dir="rtl">
      <div className="w-full h-full overflow-y-scroll flex justify-center">
        <form
          className="w-fit space-y-12 md:pt-10 max-md:px-4"
          onSubmit={handleSubmit}
        >
          <Link
            to="/welcome"
            className=" md:absolute md:top-4 md:left-4 m-4 flex justify-end text-base font-semibold text-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
              />
            </svg>
          </Link>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-3xl mb-4 font-semibold leading-7 text-gray-900 underline">
              הרשמה באתי להקשיב
            </h2>
            <p className="mt-1 text-lg leading-6 max-w-[500px] text-gray-600">
              תודה רבה לכם על הרשמתכם לאפליקציה שלנו! כל עזרה מצדכם תתקבל בברכה
              ובשמחה. אנו מאמינים כי בעזרתכם נוכל לסייע לקרובים שלנו ולחברה
              כולה, ולהקל על אנשים החווים קשיים בתקופה זו. ההשתתפות שלכם
              משמעותית וחשובה, וביחד נוכל לתמוך באנשים שזקוקים לכך ולהביא לשינוי
              חיובי בחייהם. הצטרפו אלינו למאמץ, ויחד נבנה עתיד טוב יותר לכולנו.
            </p>
          </div>
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-xl font-semibold leading-7 text-gray-900">
              פרופיל
            </h2>
            <p className="mt-1 text-base leading-6 max-w-[500px] text-gray-600">
              ההרשמה תשלח לאישור ולאחר מכן נוכל לאפשר לכם כניסה לאפליקציה ולעזור
              לאנשים למצוא אתכם. תהליך האישור נועד להבטיח שכל תומך מתאים
              ומשמעותי, וכך נוכל להציע את העזרה הטובה ביותר למי שזקוק לה.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="name"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  {" "}
                  <span className="text-red-500 ml-1">*</span>
                  שם פרטי
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    autoComplete="firstName"
                    value={registration.firstName}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="name"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  שם משפחה
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    autoComplete="lastName"
                    value={registration.lastName}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  דוא"ל
                </label>
                <div className="mt-2" dir="ltr">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={registration.email}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="password"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  סיסמא
                </label>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    autoComplete="new-password"
                    className="block w-full rounded-md border-0 py-1.5 pr-8 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                    value={registration.password}
                    onChange={handleChange}
                    required
                  />
                  <span
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  >
                    {passwordVisible ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    )}
                  </span>
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="phone"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  מספר טלפון
                </label>
                <div className="mt-2">
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    autoComplete="tel"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                    value={registration.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="birthYear"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  שנת לידה
                </label>
                <div className="mt-2">
                  <select
                    id="birthYear"
                    name="birthYear"
                    value={registration.birthYear}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                    required
                  >
                    <option value="not-selected">בחר שנה</option>
                    {Array.from(
                      { length: 83 },
                      (_, i) => new Date().getFullYear() - 18 - i
                    ).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="gender"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  מגדר
                </label>
                <div className="mt-2">
                  <select
                    id="gender"
                    name="gender"
                    autoComplete="gender"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                    value={registration.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="not-selected">בחר</option>
                    <option value="woman">אישה</option>
                    <option value="man">גבר</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="location"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  איזור
                </label>
                <div className="mt-2">
                  <select
                    id="area"
                    name="area"
                    value={registration.area}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                    required
                  >
                    <option value="not-selected">בחר</option>
                    <option value="צפון">צפון</option>
                    <option value="מרכז">מרכז</option>
                    <option value="דרום">דרום</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="city"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  עיר
                </label>
                <div className="mt-2">
                  <Autocomplete
                    id="city"
                    options={cities}
                    getOptionLabel={(option) => option}
                    value={registration.city}
                    onChange={(event, newValue) => {
                      setRegistration((prevState) => ({
                        ...prevState,
                        city: newValue || null,
                      }));
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option === value || value === null
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        fullWidth
                        required
                        sx={{
                          "& .MuiInputBase-root": {
                            width: "100%",
                            borderRadius: "0.375rem",
                            border: "0",
                            paddingY: "0.001rem", // Adjust paddingY to make the input height smaller
                            color: "#1f2937",
                            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                            backgroundColor: "#ffffff",
                            "&:hover": {
                              backgroundColor: "#ffffff",
                            },
                            "&.Mui-focused": {
                              backgroundColor: "#ffffff",
                              boxShadow: "0 0 0 2px rgba(67, 56, 202, 0.3)",
                              outline: "none", // Remove the default focus ring
                            },
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderWidth: "1px",
                            borderColor: "#d1d5db",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#d1d5db", // Keep the border color the same on hover
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#d1d5db", // Keep the border color the same when focused
                            borderWidth: "1px",
                          },
                          "& .MuiInputBase-input": {
                            outline: "none", // Ensure no outline on the input element itself
                          },
                          fontSize: "0.875rem",
                          lineHeight: "1.25rem", // Adjust lineHeight to make the input height smaller
                        }}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="password"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  כתובת
                </label>
                <div className="mt-2">
                  <input
                    id="address"
                    name="address"
                    type="address"
                    autoComplete="address"
                    value={registration.address}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="preferredLanguage"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  שפה מועדפת?
                </label>
                <div className="mt-2">
                  <select
                    id="preferredLanguage"
                    name="preferredLanguage"
                    autoComplete="language"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                    value={registration.preferredLanguage}
                    onChange={handleChange}
                    required
                  >
                    <option value="hebrew">עברית</option>
                    <option value="english">English</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="meeting"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  אופן המפגש
                </label>
                <div className="mt-2 flex justify-around items-center">
                  <span
                    className={`relative inline-flex items-center rounded-md bg-blue-50 px-8 py-2 text-base font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 cursor-pointer ${
                      registration.meeting.includes(meetingOffline) ? "" : ""
                    }`}
                    onClick={() => handleBadgeClick(meetingOffline)}
                  >
                    מפגש
                    {registration.meeting.includes(meetingOffline) && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="absolute p-1 top-0 left-0 size-6 text-gray-700"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                    )}
                  </span>
                  <span
                    className={`relative inline-flex items-center rounded-md bg-indigo-50 px-8 py-2  text-base font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 cursor-pointer ${
                      registration.meeting.includes(meetingOnline) ? "" : ""
                    }`}
                    onClick={() => handleBadgeClick(meetingOnline)}
                  >
                    וידיאו
                    {registration.meeting.includes(meetingOnline) && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="absolute p-1 top-0 left-0 size-6 text-gray-700"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                    )}
                  </span>
                  <span
                    className={`relative inline-flex items-center rounded-md bg-purple-50  px-8 py-2  text-base font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 cursor-pointer ${
                      registration.meeting.includes(phoneCall) ? "" : ""
                    }`}
                    onClick={() => handleBadgeClick(phoneCall)}
                  >
                    טלפון
                    {registration.meeting.includes(phoneCall) && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="absolute p-1 top-0 left-0 size-6 text-gray-700"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                    )}
                  </span>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="referralSource"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  <span className="text-red-500 ml-1">*</span>
                  איך הגעת אלינו
                </label>
                <div className="mt-2">
                  <select
                    id="referralSource"
                    name="referralSource"
                    value={registration.referralSource}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                    required
                  >
                    <option value="not-selected">בחר</option>
                    <option value="Instagram">אינסטגרם</option>
                    <option value="Facebook">פייסבוק</option>
                    <option value="Google Search">חיפוש בגוגל</option>
                    <option value="Friend or Family">חבר או בן משפחה</option>
                    <option value="Organization">ארגון</option>
                    <option value="Other">אחר</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="about"
                  className="block text-base font-medium leading-6 text-gray-900"
                >
                  קצת על עצמך
                </label>
                <div className="mt-2">
                  <textarea
                    id="about"
                    name="about"
                    rows={3}
                    maxLength={200} // Set the maximum character limit here
                    onChange={handleChange}
                    className="placeholder-custom block w-full rounded-md border-0 py-1.5 max-md:h-40 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
                    placeholder="כתבו בקצרה על עצמכם: שם, גיל, עיר מגורים, רקע אקדמי, סוג התמיכה שאתם מציעים.
**לדוגמה**: אני נועה, בת 36 מרעננה, בעלת תואר שני בפסיכולוגיה קלינית. התמחיתי בהתמודדות עם משברים אישיים. אשמח להכיר אותך ולעזור לך להתגבר על האתגרים שאתה חווה."
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p className="mt-3 text-base leading-6 text-gray-600">
                    כתוב על עצמך בכמה משפטים
                  </p>
                  <p className="mt-1 text-base leading-6 text-gray-600">
                    200 / {charCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-xl font-semibold leading-7 text-gray-900">
              העלאת מסמכים
            </h2>
            <p className="mt-1 text-base leading-6 max-w-[500px] text-gray-600">
              העלאת מסמכים אלו הכרחיים על מנת שנוכל לבצע תהליך אישור כראוי
            </p>
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <div className="mt-2">
                  <input
                    id="studentApproval"
                    name="studentApproval"
                    type="file"
                    className="hidden"
                    ref={studentApprovalRef}
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleClick(studentApprovalRef)}
                  >
                    <FileInput
                      text={"אישור לימודים/סיום לימודים"}
                      file={registration.studentApproval}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-3">
                <div className="mt-2">
                  <input
                    id="resume"
                    name="resume"
                    type="file"
                    className="hidden"
                    ref={resumeRef}
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => handleClick(resumeRef)}
                  >
                    <FileInput text={"קורות חיים"} file={registration.resume} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Field className="flex gap-x-4 sm:col-span-2" id="terms" required>
            <div className="flex h-6 items-center">
              <Switch
                checked={agreed}
                onChange={setAgreed}
                dir="ltr"
                className="group flex w-8 flex-none cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 data-[checked]:bg-indigo-600"
              >
                <span className="sr-only">הסכמה לתנאים</span>
                <span
                  aria-hidden="true"
                  className="h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out group-data-[checked]:translate-x-3.5"
                />
              </Switch>
            </div>
            <Label className="text-sm leading-6 text-gray-600">
              על ידי בחירה זו, אתה מסכים ל{" "}
              <a href="#" className="font-semibold text-indigo-600">
                תנאים
              </a>
              .
            </Label>
          </Field>

          {error && <h3>{error}</h3>}
          <div className="mt-6 flex items-center justify-center gap-x-6">
            <Link
              to="/welcome"
              className="text-lg font-semibold leading-6 text-gray-900 mb-20 max-md:mb-28"
            >
              בטל
            </Link>

            <button
              type="submit"
              className="btn-wide flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 mb-20 max-md:mb-28 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <p className="mx-2"> הירשם </p>{" "}
              <Loading show={status == "loading"} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupporterRegistration;
