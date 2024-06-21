import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase_config";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/userContext";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setFormDetails,
  setUserType,
  userTypeClient,
} from "../../redux/features/registrationSlice";

const ClientRegistration = () => {
  const [confirmEmail, setConfirmEmail] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();

  const [registration, setRegistration] = useState({
    email: "",
    password: "",
    name: "",
    gender: "",
    age: 18,
    location: "not-selected",
    relationshipStatus: "not-selected",
    recentStatus: "not-selected",
    religious: "not-selected",
    referralSource: "not-selected",
    preferredLanguage: "hebrew",
  });

  const fromDetails = useSelector((state) => state.registration.formDetails);
  const dispatch = useDispatch();

  const handleChange = ({ target }) => {
    const key = target.id;
    const value = target.value;
    setRegistration({ ...registration, [key]: value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (registration.email !== confirmEmail) {
      setError("Emails do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registration.email,
        registration.password
      );
      const userId = userCredential.user.uid;

      await updateProfile(userCredential.user, {
        displayName: registration.name,
      });
      await setDoc(doc(db, "userChats", userId), {});
      await setDoc(doc(db, "users", userId), registration);
      // TODO update redux
      dispatch(setUserType(userTypeClient));
      dispatch(setFormDetails(registration));
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  if (user) {
    navigate("/");
    return null;
  }

  return (
    <div className="w-full max-w-lg p-6 bg-gray-100 rounded-lg shadow-md">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="gender" className="block text-sm font-medium">
              זהות המגדרית?
            </label>
            <select
              id="gender"
              className="w-full py-3 rounded-md px-1 border border-gray-300"
              value={registration.gender}
              onChange={handleChange}
              required
            >
              <option value="not-selected">בחר</option>
              <option value="woman">אישה</option>
              <option value="man">גבר</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="age" className="block text-sm font-medium">
              גיל?
            </label>
            <input
              id="age"
              type="number"
              className="input w-full p-2 border border-gray-300 rounded-md"
              value={registration.age}
              onChange={(e) => {
                const newAge = e.target.value;
                if (newAge === "" || newAge >= 18) {
                  setRegistration({ ...registration, age: newAge });
                }
              }}
              min="18"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium">
              מאיפה את/ה
            </label>
            <select
              id="location"
              className="w-full py-3 rounded-md px-1 border border-gray-300"
              value={registration.location}
              onChange={handleChange}
              required
            >
              <option value="not-selected">בחר איזור</option>
              <option value="צפון">צפון</option>
              <option value="מרכז">מרכז</option>
              <option value="דרום">דרום</option>
            </select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="relationshipStatus"
              className="block text-sm font-medium"
            >
              סטטוס יחסים?
            </label>
            <select
              id="relationshipStatus"
              className="w-full py-3 rounded-md px-1 border border-gray-300"
              value={registration.relationshipStatus}
              onChange={handleChange}
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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="recentStatus" className="block text-sm font-medium">
              מצבך בתקופה האחרונה?
            </label>
            <select
              id="recentStatus"
              className="w-full py-3 rounded-md px-1 border border-gray-300"
              value={registration.recentStatus}
              onChange={handleChange}
              required
            >
              <option value="not-selected">בחר</option>
              <option value="חייל/ת">חייל/ת</option>
              <option value="מילואימניק/ית">מילואימניק/ית</option>
              <option value="נפגע/ת נובה">נפגע/ת נובה</option>
              <option value="אחר">אחר</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="religious" className="block text-sm font-medium">
              האם את/ה דתי?
            </label>
            <select
              id="religious"
              className="w-full py-3 rounded-md px-1 border border-gray-300"
              value={registration.religious}
              onChange={handleChange}
            >
              <option value="not-selected">בחר</option>
              <option value="לא">לא</option>
              <option value="כן">כן</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="referralSource"
              className="block text-sm font-medium"
            >
              מי הפנה אתכם אלינו?
            </label>
            <select
              id="referralSource"
              className="w-full py-3 rounded-md px-1 border border-gray-300"
              value={registration.referralSource}
              onChange={handleChange}
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
          <div className="space-y-2">
            <label
              htmlFor="preferredLanguage"
              className="block text-sm font-medium"
            >
              שפה מועדפת?
            </label>
            <select
              id="preferredLanguage"
              className="w-full py-3 rounded-md px-1 border border-gray-300"
              value={registration.preferredLanguage}
              onChange={handleChange}
              required
            >
              <option value="hebrew">עברית</option>
              <option value="english">אנגלית</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="displayName" className="block text-sm font-medium">
              שם מלא (או כינוי)
            </label>
            <input
              id="name"
              type="text"
              className="input w-full p-2 border border-gray-300 rounded-md"
              value={registration.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              דוא"ל
            </label>
            <input
              id="email"
              type="email"
              className="input w-full p-2 border border-gray-300 rounded-md text-base pl-2 text-end"
              value={registration.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="confirmEmail" className="block text-sm font-medium">
              אשרו את הדוא"ל
            </label>
            <input
              id="confirmEmail"
              type="email"
              className="input w-full p-2 border border-gray-300 rounded-md text-base pl-2 text-end"
              value={confirmEmail}
              onChange={({ target }) => setConfirmEmail(target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              צרו סיסמה
            </label>
            <input
              id="password"
              type="password"
              className="input w-full p-2 border border-gray-300 rounded-md text-end"
              value={registration.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <input id="terms" type="checkbox" className="checkbox" required />
          <label htmlFor="terms" className="text-sm font-medium pr-2">
            אני מסכים לתנאים וההגבלות ולמדיניות הפרטיות
          </label>
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="flex flex-col items-end space-y-4">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            הרשמה
          </button>
          <div className="text-sm text-center w-full">
            כבר יש לך חשבון?{" "}
            <Link to="/login" className="text-blue-500">
              התחבר
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ClientRegistration;
