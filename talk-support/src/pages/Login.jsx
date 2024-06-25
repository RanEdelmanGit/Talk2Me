import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase_config";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styles/loginPage.css";
import { useDispatch } from "react-redux";
import { setUid } from "../redux/features/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // To show messages like password reset email sent
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const uid = auth.currentUser.uid;
      dispatch(setUid(uid));
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
      const uid = auth.currentUser.uid;
      dispatch(setUid(uid));
      navigate("/");
    }
  }, []);
  const handlePasswordReset = async () => {
    setError(null);
    setMessage(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Please check your inbox.");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="login-container" dir="rtl">
        <h2 className="text-2xl font-bold mb-4">התחברות</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label htmlFor="email" className="block mb-2">
              אימייל:
            </label>
            <input
              id="email"
              type="email"
              className="p-2 border border-gray-300 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="password" className="block mb-2">
              סיסמה:
            </label>
            <input
              id="password"
              type="password"
              className="p-2 border border-gray-300 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <div className="error-message text-red-500 mb-4">{error}</div>
          )}
          {message && (
            <div className="message text-green-500 mb-4">{message}</div>
          )}
          <div className="form-group">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              התחבר
            </button>
          </div>
        </form>
        <p className="registration-link mt-4 text-center">
          אין לך חשבון?{" "}
          <Link to="/register" className="text-blue-500">
            הירשם
          </Link>
        </p>
        <p className="forgot-password-link mt-2 text-center">
          <button onClick={handlePasswordReset} className="text-blue-500">
            שכחת סיסמה?
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
