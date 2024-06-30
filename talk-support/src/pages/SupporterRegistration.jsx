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
import { useDispatch } from "react-redux";
import {
  setFormDetails,
  setUserType,
  meetingAll,
  meetingOffline,
  meetingOnline,
  userTypeSupporter,
  setUid,
} from "../redux/features/authSlice";
import FileInput from "../components/common/FileInput";

const SupporterRegistration = () => {
  const [error, setError] = useState(null);
  const [idDoc, setIdDoc] = useState(null);
  const [studentApproval, setStudentApproval] = useState(null);
  const [grades, setGrades] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

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

  const [registration, setRegistration] = useState({
    email: "",
    phone: "",
    password: "",
    firstName: "",
    lastName: "",
    meeting: "not-selected",
    gender: "not-selected",
    age: 18,
    birthYear: "not-selected",
    location: "not-selected",
    city: "not-selected",
    address: "",
    area: "not-selected",
    referralSource: "not-selected",
    preferredLanguage: "hebrew",
    approved: false,
  });

  const handleFileUpload = (e, setFile) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const requiredFields = [
      { key: "gender", label: "Gender" },
      { key: "location", label: "Location" },
      { key: "relationshipStatus", label: "Relationship Status" },
      { key: "religious", label: "Religious Status" },
      { key: "referralSource", label: "Referral Source" },
      { key: "meeting", label: "Meeting Preference" },
    ];

    for (let field of requiredFields) {
      if (registration[field.key] === "not-selected") {
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
        displayName: registration.firstName + registration.lastName,
      });
      await setDoc(doc(db, "userChats", userId), {});

      const uploadFile = async (file, filePath) => {
        const fileRef = storageRef(storage, filePath);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
      };

      if (idDoc) {
        registration.idDocURL = await uploadFile(
          idDoc,
          `supporters/${userId}/idDoc`
        );
      }
      if (studentApproval) {
        registration.studentApprovalURL = await uploadFile(
          studentApproval,
          `supporters/${userId}/studentApproval`
        );
      }
      if (grades) {
        registration.gradesURL = await uploadFile(
          grades,
          `supporters/${userId}/grades`
        );
      }
      if (profilePic) {
        registration.profilePicURL = await uploadFile(
          profilePic,
          `supporters/${userId}/profilePic`
        );
      }

      await setDoc(doc(db, "supporters", userId), registration);
      dispatch(setUserType(userTypeSupporter));
      dispatch(setFormDetails(registration));
      dispatch(setUid(userId));
      navigate("/");
      setShowModal(true);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center" dir="rtl">
      <form className="space-y-12 my-8 max-md:px-4" onSubmit={handleSubmit}>
        <Link
          to="/welcome"
          className="flex justify-end text-base font-semibold text-gray-900"
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
          <h2 className="text-2xl mb-4 font-semibold leading-7 text-gray-900 underline">
            הרשמה באתי להקשיב
          </h2>
          <p className="mt-1 text-base leading-6 max-w-[500px] text-gray-600">
            תודה רבה לכם על הרשמתכם לאפליקציה שלנו! כל עזרה מצדכם תתקבל בברכה
            ובשמחה. אנו מאמינים כי בעזרתכם נוכל לסייע לקרובים שלנו ולחברה כולה,
            ולהקל על אנשים החווים קשיים בתקופה זו. ההשתתפות שלכם משמעותית
            וחשובה, וביחד נוכל לתמוך באנשים שזקוקים לכך ולהביא לשינוי חיובי
            בחייהם. הצטרפו אלינו למאמץ, ויחד נבנה עתיד טוב יותר לכולנו.
          </p>
        </div>
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-xl font-semibold leading-7 text-gray-900">
            פרופיל
          </h2>
          <p className="mt-1 text-sm leading-6 max-w-[500px] text-gray-600">
            ההרשמה תשלח לאישור ולאחר מכן נוכל לאפשר לכם כניסה לאפליקציה ולעזור
            לאנשים למצוא אתכם. תהליך האישור נועד להבטיח שכל תומך מתאים ומשמעותי,
            וכך נוכל להציע את העזרה הטובה ביותר למי שזקוק לה.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                />
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                סיסמא
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={registration.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="phone"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                טלפון
              </label>
              <div className="mt-2">
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  autoComplete="tel"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={registration.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="birthYear"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                שנת לידה
              </label>
              <div className="mt-2">
                <select
                  id="birthYear"
                  name="birthYear"
                  value={registration.birthYear}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                מגדר
              </label>
              <div className="mt-2">
                <select
                  id="gender"
                  name="gender"
                  autoComplete="gender"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                איזור
              </label>
              <div className="mt-2">
                <select
                  id="area"
                  name="area"
                  value={registration.area}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                htmlFor="location"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                עיר
              </label>
              <div className="mt-2">
                <select
                  id="city"
                  name="city"
                  value={registration.city}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                >
                  <option value="not-selected">בחר</option>
                  <option value="אילת">אילת</option>
                  <option value="אשדוד">אשדוד</option>
                  <option value="אשקלון">אשקלון</option>
                  <option value="באר שבע">באר שבע</option>
                  <option value="גבעתיים">גבעתיים</option>
                  <option value="דימונה">דימונה</option>
                  <option value="הרצליה">הרצליה</option>
                  <option value="חיפה">חיפה</option>
                  <option value="טבריה">טבריה</option>
                  <option value="ירוחם">ירוחם</option>
                  <option value="כפר סבא">כפר סבא</option>
                  <option value="קרית גת">קרית גת</option>
                  <option value="קרית שמונה">קרית שמונה</option>
                  <option value="נהריה">נהריה</option>
                  <option value="נצרת">נצרת</option>
                  <option value="נתניה">נתניה</option>
                  <option value="עכו">עכו</option>
                  <option value="עפולה">עפולה</option>
                  <option value="פתח תקווה">פתח תקווה</option>
                  <option value="רמת גן">רמת גן</option>
                  <option value="תל אביב-יפו">תל אביב-יפו</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
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
                  className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="preferredLanguage"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                שפה מועדפת?
              </label>
              <div className="mt-2">
                <select
                  id="preferredLanguage"
                  name="preferredLanguage"
                  autoComplete="language"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={registration.preferredLanguage}
                  onChange={handleChange}
                  required
                >
                  <option value="hebrew">עברית</option>
                  <option value="english">אנגלית</option>
                </select>
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="meeting"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                אופן המפגש
              </label>
              <div className="mt-2">
                <select
                  id="meeting"
                  name="meeting"
                  autoComplete="meeting"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={registration.meeting}
                  onChange={handleChange}
                  required
                >
                  <option value="not-selected">בחר אופן מפגש</option>
                  <option value={meetingOffline}>מפגש פנים אל פנים</option>
                  <option value={meetingOnline}>מרחוק</option>
                  <option value={meetingAll}>שניהם</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-xl font-semibold leading-7 text-gray-900">
            העלאת מסמכים
          </h2>
          <p className="mt-1 text-sm leading-6 max-w-[500px] text-gray-600">
            העלאת מסמכים אלו הכרחיים על מנת שנוכל לבצע תהליך אישור כראוי
          </p>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <div className="mt-2">
                <input
                  id="idDoc"
                  name="idDoc"
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, setIdDoc)}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <div
                  className="flex items-center cursor-pointer"
                  onClick={handleClick}
                >
                  <FileInput text={"תעודת זהות"} />
                </div>
              </div>
            </div>

            <div className="sm:col-span-3">
              <div className="mt-2">
                <input
                  id="studentApproval"
                  name="studentApproval"
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, setStudentApproval)}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <div
                  className="flex items-center cursor-pointer"
                  onClick={handleClick}
                >
                  <FileInput text={"אישור סטודנט"} />
                </div>
              </div>
            </div>

            <div className="sm:col-span-3">
              <div className="mt-2">
                <input
                  id="grades"
                  name="grades"
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, setGrades)}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <div
                  className="flex items-center cursor-pointer"
                  onClick={handleClick}
                >
                  <FileInput text={"גיליון ציונים"} />
                </div>
              </div>
            </div>

            <div className="sm:col-span-3">
              <div className="mt-2">
                <input
                  name="profilePic"
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".jpg,.jpeg,.png"
                />
                <div
                  className="flex items-center cursor-pointer"
                  onClick={handleClick}
                >
                  <FileInput text={"תמונת פרופיל"} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-x-6">
          <Link
            to="/welcome"
            className="text-base font-semibold leading-6 text-gray-900"
          >
            בטל
          </Link>
          <button
            type="submit"
            className="rounded-md btn-wide bg-indigo-600 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            הרשמה
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupporterRegistration;
