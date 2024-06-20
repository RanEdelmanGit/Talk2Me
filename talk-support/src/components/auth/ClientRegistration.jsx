import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase_config";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/userContext";
import { Link } from "react-router-dom";
import "../../styles/registrationPage.css";

const ClientRegistration = () => {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [relationshipStatus, setRelationshipStatus] = useState("");
  const [recentStatus, setRecentStatus] = useState("");
  const [religious, setReligious] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (email !== confirmEmail) {
      setError("Emails do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;

      await updateProfile(userCredential.user, { displayName });
      await setDoc(doc(db, "userChats", userId), {});

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
              className="input"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">בחר</option>
              <option value="אישה">אישה</option>
              <option value="גבר">גבר</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="age" className="block text-sm font-medium">
              גיל?
            </label>
            <input
              id="age"
              type="number"
              className="input"
              value={age}
              onChange={(e) => setAge(e.target.value)}
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
              className="input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">בחר איזור</option>
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
              className="input"
              value={relationshipStatus}
              onChange={(e) => setRelationshipStatus(e.target.value)}
            >
              <option value="">בחר</option>
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
              className="input"
              value={recentStatus}
              onChange={(e) => setRecentStatus(e.target.value)}
            >
              <option value="">בחר</option>
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
              className="input"
              value={religious}
              onChange={(e) => setReligious(e.target.value)}
            >
              <option value="">בחר</option>
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
              className="input"
              value={referralSource}
              onChange={(e) => setReferralSource(e.target.value)}
            >
              <option value="">בחר</option>
              <option value="אינסטגרם">אינסטגרם</option>
              <option value="פודקאסט">פודקאסט</option>
              <option value="דיוור ישיר">דיוור ישיר</option>
              <option value="פייסבוק">פייסבוק</option>
              <option value="חיפוש בגוגל">חיפוש בגוגל</option>
              <option value="יוטיוב">יוטיוב</option>
              <option value="מגזין או עיתון">מגזין או עיתון</option>
              <option value="ידוען">ידוען</option>
              <option value="טלוויזיה">טלוויזיה</option>
              <option value="רדיו">רדיו</option>
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
              className="input"
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
            >
              <option value="">בחר</option>
              <option value="אנגלית">אנגלית</option>
              <option value="עברית">עברית</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="displayName" className="block text-sm font-medium">
              שם פרטי (או כינוי)
            </label>
            <input
              id="displayName"
              type="text"
              className="input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              דוא"ל
            </label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              className="input"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              צרו סיסמה
            </label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
