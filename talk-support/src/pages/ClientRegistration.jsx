import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDoc, doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase_config";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../components/common/Loading";
import {
  setFormDetails,
  setUserType,
  userTypeClient,
  setUid,
} from "../redux/features/authSlice";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Field, Label, Switch } from '@headlessui/react';
import { cities } from "../cities";

const ClientRegistration = () => {
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { status } = useSelector((store) => store.auth);
  const [agreed, setAgreed] = useState(false)

  const [registration, setRegistration] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    nickname: "",
    gender: "not-selected",
    age: 18,
    birthYear: "not-selected",
    city: null,
    address: "",
    area: "not-selected",
    recentStatus: "not-selected",
    referralSource: "not-selected",
    preferredLanguage: "hebrew",
  });

  const dispatch = useDispatch();

  const handleChange = ({ target }) => {
    const key = target.id;
    const value = target.value;

    if (key === "birthYear") {
      const currentYear = new Date().getFullYear();
      const calculatedAge = currentYear - value;
      if (calculatedAge >= 18) {
        setRegistration({ ...registration, [key]: value, age: calculatedAge });
      }
    } else {
      setRegistration({ ...registration, [key]: value });
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const requiredFields = [
    { key: "nickname", label: "Nickname" },
    { key: "recentStatus", label: "Recent Status" },
    { key: "gender", label: "Gender" },
    { key: "birthYear", label: "Birth Year" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "password", label: "Password" },
    { key: "area", label: "Area" },
    { key: "city", label: "City" },
    { key: "address", label: "Address" },
    { key: "referralSource", label: "Referral Source" },
    { key: "preferredLanguage", label: "Language" }
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
  
    if (
      registration.nickname.toLowerCase().includes(registration.firstName.toLowerCase()) ||
      registration.nickname.toLowerCase().includes(registration.lastName.toLowerCase())
    ) {
      setError("Nickname should not contain your first or last name.");
      return;
    }
  
    // Validation for required fields
    for (let field of requiredFields) {
      if (
        registration[field.key] === "not-selected" ||
        registration[field.key] === "" ||
        registration[field.key] === null
      ) {
        setError(`Please select a valid option for ${field.label}`);
        return;
      }
    }
  
    try {
      // Check if nickname already exists
      const nicknameQuery = query(
        collection(db, "nicknames"),
        where("nickname", "==", registration.nickname)
      );
      const nicknameSnapshot = await getDocs(nicknameQuery);
  
      if (!nicknameSnapshot.empty) {
        setError("Nickname already exists. Please choose another one.");
        return;
      }
  
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registration.email,
        registration.password
      );
      const userId = userCredential.user.uid;
      const user = { ...registration, uid: userId };
      user.chats = [];
      await updateProfile(userCredential.user, {
        displayName: registration.firstName + " " + registration.lastName,
      });
  
      await setDoc(doc(db, "clients", userId), user);
  
      // Add nickname to nicknames collection
      await setDoc(doc(db, "nicknames", userId), {
        nickname: registration.nickname
      });
  
      // Update Redux
      dispatch(setUserType(userTypeClient));
      dispatch(setFormDetails(registration));
      setRegistrationComplete(true);
      dispatch(setUid(userId));
      localStorage.setItem("userType", userTypeClient);
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen" dir="rtl">
    <div className="w-full h-full overflow-y-scroll flex justify-center">
      <form className="w-fit space-y-12 max-md:px-4 pt-10 " onSubmit={handleSubmit}>
        <Link
          to="/welcome"
          className="absolute top-4 left-4 m-4 flex justify-end text-base font-semibold text-gray-900"
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
              d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
            />
          </svg>
        </Link>
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-3xl mb-4 font-semibold leading-7 text-gray-900 underline">
            הרשמה באתי לשתף
          </h2>
          <p className="mt-1 text-lg leading-6 max-w-[500px] text-gray-600">
            מילוי הפרטים הבאים הזהות והשיחות שלך יישארו אנונימיים, ויוצגו רק
            המידע הרלוונטי למצבך. הזהות האישית שלך תישאר פרטית עד שתבחר לחשוף
            אותה או להחליף פרטי התקשרות עם התומך שלך. אנו מאמינים שלכל אחד מגיעה
            הזכות להישמע ולקבל תמיכה.
          </p>
        </div>
        {/* --------------------------------------------------------------------------------------------------------------------------------- */}
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-xl font-semibold leading-7 text-gray-900">
            פרופיל
          </h2>
          <p className="mt-1 text-base leading-6 max-w-[500px] text-gray-600">
            חלק זה נועד לעזור לתומכים שלנו להבין מה הכי חשוב לך, כדי שיוכלו לספק
            את התמיכה הטובה ביותר מבלי לדעת פרטים אישיים שלך.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="name"
                className="block text-base font-medium leading-6 text-gray-900"
              >
                <span className="text-red-500 ml-1">*</span>
               שם משתמש (כינוי)  
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="nickname"
                  id="nickname"
                  autoComplete="nickname"
                  value={registration.nickname}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="recentStatus"
                className="block text-base font-medium leading-6 text-gray-900"
              >
                <span className="text-red-500 ml-1">*</span>
                מצבך לאחרונה
              </label>
              <div className="mt-2">
                <select
                  id="recentStatus"
                  name="recentStatus"
                  value={registration.recentStatus}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                  required
                >
                  <option value="not-selected">בחר</option>
                  <option value="חייל/ת">חייל/ת</option>
                  <option value="מילואימניק/ית">מילואימניק/ית</option>
                  <option value="נפגע/ת נובה">נפגע/ת נובה</option>
                  <option value="אחר">אחר</option>
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
                  value={registration.gender}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
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
          </div>
        </div>
        {/* -------------------------------------------------------------------------------------------------------------------------- */}
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-xl font-semibold leading-7 text-gray-900">
            פרטים אישיים
          </h2>
          <p className="mt-1 text-base leading-6 max-w-[500px] text-gray-600">
            פרטים אישיים אינם נראים למשתמשים אחרים באפליקציה
          </p>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="name"
                className="block text-base font-medium leading-6 text-gray-900"
              >
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
          </div>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
                        '& .MuiInputBase-root': {
                          width: '100%',
                          borderRadius: '0.375rem',
                          border: '0',
                          paddingY: '0.001rem', // Adjust paddingY to make the input height smaller
                          color: '#1f2937',
                          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                          backgroundColor: '#ffffff',
                          '&:hover': {
                            backgroundColor: '#ffffff',
                          },
                          '&.Mui-focused': {
                            backgroundColor: '#ffffff',
                            boxShadow: '0 0 0 2px rgba(67, 56, 202, 0.3)',
                            outline: 'none', // Remove the default focus ring
                          },
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderWidth: '1px',
                          borderColor: '#d1d5db',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#d1d5db', // Keep the border color the same on hover
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#d1d5db', // Keep the border color the same when focused
                          borderWidth: '1px',
                        },
                        '& .MuiInputBase-input': {
                          outline: 'none', // Ensure no outline on the input element itself
                        },
                        fontSize: '0.875rem',
                        lineHeight: '1.25rem', // Adjust lineHeight to make the input height smaller
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

            <div className="sm:col-span-3">
              <label
                htmlFor="preferredLanguage"
                className="block text-base font-medium leading-6 text-gray-900"
              >
                <span className="text-red-500 ml-1">*</span>
                שפה מועדפת
              </label>
              <div className="mt-2">
                <select
                  id="preferredLanguage"
                  name="preferredLanguage"
                  value={registration.preferredLanguage}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                  required
                >
                  <option value="hebrew">עברית</option>
                  <option value="english">English</option>
                </select>
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
              על ידי בחירה זו, אתה מסכים ל{' '}
              <a href="#" className="font-semibold text-indigo-600">
              תנאים              </a>
              .
            </Label>
          </Field>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="mt-6 flex items-center justify-center gap-x-6">
          <Link
            to="/welcome"
            className="text-lg font-semibold leading-6 text-gray-900 mb-20 max-md:mb-28"
          >
            בטל
          </Link>
          <button
            type="submit"
            className=" btn-wide flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 mb-20 max-md:mb-28 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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

export default ClientRegistration;
