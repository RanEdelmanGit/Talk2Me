import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase_config";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setFormDetails,
  setUserType,
  userTypeClient,
  setUid,
} from "../redux/features/authSlice";

const ClientRegistration = () => {
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [registration, setRegistration] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    username: "",
    gender: "not-selected",
    age: 18,
    birthYear: "not-selected",
    city: "not-selected",
    address: "",
    area: "not-selected",
    relationshipStatus: "not-selected",
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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!validateEmail(registration.email)) {
      setError("Invalid email format.");
      return;
    }

    if (!validatePhone(registration.phone)) {
      setError("Invalid phone format. Please enter a 10-digit phone number.");
      return;
    }

    // Validation for "not-selected" options
    const requiredFields = [
      { key: "gender", label: "Gender" },
      { key: "birthYear", label: "Birth Year" },
      { key: "area", label: "Area" },
      { key: "city", label: "City" },
      { key: "relationshipStatus", label: "Relationship Status" },
      { key: "recentStatus", label: "Recent Status" },
      { key: "referralSource", label: "Referral Source" },
      { key: "preferredLanguage", label: "Language" },
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
      const user = { ...registration, uid: userId };

      await updateProfile(userCredential.user, {
        displayName: registration.firstName + " " + registration.lastName,
      });

      await setDoc(doc(db, "clients", userId), user);

      // Update Redux
      dispatch(setUserType(userTypeClient));
      dispatch(setFormDetails(registration));
      setRegistrationComplete(true);
      dispatch(setUid(userId));
      navigate("/");
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
            הרשמה באתי לדבר
          </h2>
          <p className="mt-1 text-base leading-6 max-w-[500px] text-gray-600">
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
          <p className="mt-1 text-sm leading-6 max-w-[500px] text-gray-600">
            חלק זה נועד לעזור לתומכים שלנו להבין מה הכי חשוב לך, כדי שיוכלו לספק
            את התמיכה הטובה ביותר מבלי לדעת פרטים אישיים שלך.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                שם משתמש
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="username"
                  id="username"
                  autoComplete="username"
                  value={registration.username}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="recentStatus"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                מצבך לאחרונה
              </label>
              <div className="mt-2">
                <select
                  id="recentStatus"
                  name="recentStatus"
                  value={registration.recentStatus}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                מגדר
              </label>
              <div className="mt-2">
                <select
                  id="gender"
                  name="gender"
                  value={registration.gender}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
          </div>
        </div>
        {/* -------------------------------------------------------------------------------------------------------------------------- */}
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-xl font-semibold leading-7 text-gray-900">
            פרטים אישיים
          </h2>
          <p className="mt-1 text-sm leading-6 max-w-[500px] text-gray-600">
            פרטים אישיים אינם נראים למשתמשים אחרים באפליקציה
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
          </div>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
                  autoComplete="current-password"
                  value={registration.password}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                />
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

            <div className="sm:col-span-3">
              <label
                htmlFor="relationshipStatus"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                סטטוס יחסים
              </label>
              <div className="mt-2">
                <select
                  id="relationshipStatus"
                  name="relationshipStatus"
                  value={registration.relationshipStatus}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                >
                  <option value="not-selected">בחר</option>
                  <option value="רווק/ה">רווק/ה</option>
                  <option value="בזוגיות">בזוגיות</option>
                  <option value="נשוי/ה">נשוי/ה</option>
                  <option value="גרוש/ה">גרוש/ה</option>
                  <option value="אלמן/ה">אלמן/ה</option>
                  <option value="אחר">אחר</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="referralSource"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                איך הגעת אלינו
              </label>
              <div className="mt-2">
                <select
                  id="referralSource"
                  name="referralSource"
                  value={registration.referralSource}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                >
                  <option value="not-selected">בחר</option>
                  <option value="אינסטגרם">אינסטגרם</option>
                  <option value="פייסבוק">פייסבוק</option>
                  <option value="חיפוש בגוגל">חיפוש בגוגל</option>
                  <option value="חבר או בן משפחה">חבר או בן משפחה</option>
                  <option value="ארגון">ארגון</option>
                  <option value="אחר">אחר</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="preferredLanguage"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                שפה מועדפת
              </label>
              <div className="mt-2">
                <select
                  id="preferredLanguage"
                  name="preferredLanguage"
                  value={registration.preferredLanguage}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                >
                  <option value="hebrew">עברית</option>
                  <option value="english">English</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="terms"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            required
          />
          <label htmlFor="terms" className="text-sm font-medium pr-2">
            אני מסכים למדיניות הפרטיות ולתקנון
          </label>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="mt-6 flex items-center justify-center gap-x-6">
          <Link
            to="/welcome"
            className="text-base font-semibold leading-6 text-gray-900"
          >
            בטל
          </Link>
          <button
            type="submit"
            className=" btn-wide rounded-md bg-indigo-600 px-3 py-2 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            הירשם
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientRegistration;
