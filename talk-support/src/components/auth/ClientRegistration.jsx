import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase_config";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/userContext";
import { Link } from "react-router-dom";
import "../../styles/registrationPage.css";

const ClientRegistration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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
    <div className="flex items-center justify-center">
      <div className="login-container" dir="rtl">
        <h2 className="text-2xl font-bold mb-4">הרשמת לקוח</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label htmlFor="displayName" className="block mb-2">שם תצוגה:</label>
            <input
              id="displayName"
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
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

export default ClientRegistration;
