import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase_config";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/userContext";
import { Link } from "react-router-dom";
import "../../styles/registrationPage.css";

const SupporterRegistration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [meeting, setMeeting] = useState("");
  const [education, setEducation] = useState("");
  const [school, setSchool] = useState("");
  const [error, setError] = useState(null);
  const [idDoc, setIdDoc] = useState(null);
  const [studentApproval, setStudentApproval] = useState(null);
  const [grades, setGrades] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();

  const handleFileUpload = (e, setFile) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;

      await updateProfile(userCredential.user, { displayName });

      await setDoc(doc(db, "userChats", userId), {});

      await setDoc(doc(db, "listeners", userId), {
        uid: userId,
        email,
        displayName,
        fullName,
        phone,
        area,
        meeting,
        education,
        school,
        active: false,
      });

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
            <label htmlFor="email" className="block text-sm font-medium">
              אימייל:
            </label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-medium">
              שם מלא:
            </label>
            <input
              id="fullName"
              type="text"
              className="input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium">
              טלפון:
            </label>
            <input
              id="phone"
              type="text"
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              סיסמה:
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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="area" className="block text-sm font-medium">
              איזור:
            </label>
            <select
              id="area"
              className="input"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            >
              <option value="">בחר איזור</option>
              <option value="צפון">צפון</option>
              <option value="מרכז">מרכז</option>
              <option value="דרום">דרום</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="meeting" className="block text-sm font-medium">
              אופן המפגש:
            </label>
            <select
              id="meeting"
              className="input"
              value={meeting}
              onChange={(e) => setMeeting(e.target.value)}
            >
              <option value="">בחר אופן מפגש</option>
              <option value="מפגש פנים אל פנים">מפגש פנים אל פנים</option>
              <option value="מרחוק">מרחוק</option>
              <option value="שניהם">שניהם</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="education" className="block text-sm font-medium">
              השכלה:
            </label>
            <select
              id="education"
              className="input"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
            >
              <option value="">בחר השכלה</option>
              <option value="תואר שני">תואר שני</option>
              <option value="תואר שלישי">תואר שלישי</option>
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="school" className="block text-sm font-medium">
              מוסד לימודים:
            </label>
            <select
              id="school"
              className="input"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
            >
              <option value="">בחר מוסד</option>
              <option value="אונ' תל אביב">אונ' תל אביב</option>
              <option value="רייכמן">רייכמן</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col justify-center ">
          <h2 className="text-center mb-4 font-bold underline">מסמכים</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="idDoc" className="block text-sm font-medium">
              תעודת זהות:
            </label>
            <input
              id="idDoc"
              type="file"
              className="file-input"
              onChange={(e) => handleFileUpload(e, setIdDoc)}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="studentApproval"
              className="block text-sm font-medium"
            >
              אישור סטודנט:
            </label>
            <input
              id="studentApproval"
              type="file"
              className="file-input"
              onChange={(e) => handleFileUpload(e, setStudentApproval)}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="grades" className="block text-sm font-medium">
              גיליון ציונים:
            </label>
            <input
              id="grades"
              type="file"
              className="file-input"
              onChange={(e) => handleFileUpload(e, setGrades)}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="profilePic" className="block text-sm font-medium">
              תמונת פרופיל:
            </label>
            <input
              id="profilePic"
              type="file"
              className="file-input"
              onChange={(e) => handleFileUpload(e, setProfilePic)}
              accept=".jpg,.jpeg,.png"
            />
          </div>
        </div>
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

export default SupporterRegistration;
