import { useState } from "react";
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
  const [displayName, setDisplayName] = useState("");
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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
    <div className="flex items-center justify-center">
      <div className="login-container" dir="rtl">
        <h2 className="text-2xl font-bold mb-4">הרשמת מאזין</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="flex-container">
            <div className="form-group mb-4">
              <label htmlFor="fullName" className="block mb-2">שם מלא:</label>
              <input
                id="fullName"
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="email" className="block mb-2">אימייל:</label>
              <input
                id="email"
                type="email"
                className="w-full p-2 border border-gray-300 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-container">
            <div className="form-group mb-4">
              <label htmlFor="password" className="block mb-2">סיסמה:</label>
              <input
                id="password"
                type="password"
                className="w-full p-2 border border-gray-300 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="phone" className="block mb-2">טלפון:</label>
              <input
                id="phone"
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-container">
            <div className="form-group mb-4">
              <label htmlFor="area" className="block mb-2">איזור:</label>
              <select
                id="area"
                className="w-full p-2 border border-gray-300 rounded"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              >
                <option value="">בחר איזור</option>
                <option value="צפון">צפון</option>
                <option value="מרכז">מרכז</option>
                <option value="דרום">דרום</option>
              </select>
            </div>
            <div className="form-group mb-4">
              <label htmlFor="meeting" className="block mb-2">אופן המפגש:</label>
              <select
                id="meeting"
                className="w-full p-2 border border-gray-300 rounded"
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
          <div className="flex-container">
            <div className="form-group mb-4">
              <label htmlFor="education" className="block mb-2">השכלה:</label>
              <select
                id="education"
                className="w-full p-2 border border-gray-300 rounded"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
              >
                <option value="">בחר השכלה</option>
                <option value="תואר שני">תואר שני</option>
                <option value="תואר שלישי">תואר שלישי</option>
              </select>
            </div>
            <div className="form-group mb-4">
              <label htmlFor="school" className="block mb-2">מוסד לימודים:</label>
              <select
                id="school"
                className="w-full p-2 border border-gray-300 rounded"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
              >
                <option value="">בחר מוסד</option>
                <option value="אונ' תל אביב">אונ' תל אביב</option>
                <option value="רייכמן">רייכמן</option>
              </select>
            </div>
          </div>
          <div className="form-group mb-4">
            <label className="block mb-2">העלאת מסמכים:</label> 
            <div className="input-file-group"> 
              <span>תעודת זהות</span>
              <input
                type="file"
                onChange={(e) => handleFileUpload(e, setIdDoc)}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <span>אישור סטודנט</span> 
              <input
                type="file"
                onChange={(e) => handleFileUpload(e, setStudentApproval)}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <span>ציונים</span>
              <input
                type="file"
                onChange={(e) => handleFileUpload(e, setGrades)}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <span>תמונת פרופיל</span>
              <input
                type="file"
                onChange={(e) => handleFileUpload(e, setProfilePic)}
                accept=".jpg,.jpeg,.png"
              />
            </div>
          </div>
          {error && <div className="error-message text-red-500 mb-4">{error}</div>}
          <div className="form-group">
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">הרשמה</button>
          </div>
        </form>
        <p className="registration-link mt-4 text-center">
          כבר יש לך חשבון? <Link to="/login" className="text-blue-500">התחבר</Link>
        </p>
      </div>
    </div>
  );
};

export default SupporterRegistration;
