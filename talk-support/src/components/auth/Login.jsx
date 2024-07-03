import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../firebase_config";
import { useNavigate } from "react-router-dom";
import "../../styles/loginPage.css";
import { useDispatch, useSelector } from "react-redux";
import { setUid, fetchUser, setUserType } from "../../redux/features/authSlice";
import Loading from "../common/Loading";

const Login = ({ setIsLoginVisible }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [logInUserType, setLoginUserType] = useState("not-selected");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, status } = useSelector((store) => store.auth);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleTypeChange = ({ target: { value } }) => {
    setLoginUserType(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!validateEmail(email)) {
      setError("Invalid email format.");
      return;
    }

    if (logInUserType === "not-selected") {
      setError("Please select a valid option for user type.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const uid = auth.currentUser.uid;
      dispatch(setUid(uid));
      dispatch(fetchUser({ uid, userType: logInUserType }));
      dispatch(setUserType(logInUserType));
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (user && user.email) {
      navigate("/chat");
    }
  }, [user]);

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
    <div className="my-14 sm:mx-auto sm:w-full sm:max-w-sm relative">
      <form className="space-y-6" method="POST" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            אימייל
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              dir="ltr"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              סיסמא
            </label>
            <div className="text-sm">
              <button
                onClick={handlePasswordReset}
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                שכחת סיסמה?
              </button>
            </div>
          </div>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="">
            <button
              className="border border-gray-300 hover:bg-gray-400 px-3 py-1 md:py-1.5 rounded"
              onClick={() => setIsLoginVisible(false)}
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
                  d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3"
                />
              </svg>
            </button>
          </div>

          <div className="mt-2 flex items-center">
            <fieldset>
              <div className="flex ">
                <div className="flex items-center">
                  <input
                    id="client"
                    name="userType"
                    type="radio"
                    value="client"
                    checked={logInUserType === "client"}
                    onChange={handleTypeChange}
                    className="focus:ring-indigo-600 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label
                    htmlFor="client"
                    className="mr-2 ml-4 block text-base font-medium text-gray-700"
                  >
                    באתי לשתף
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="supporter"
                    name="userType"
                    type="radio"
                    value="supporter"
                    checked={logInUserType === "supporter"}
                    onChange={handleTypeChange}
                    className="focus:ring-indigo-600 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label
                    htmlFor="supporter"
                    className="mr-2 ml-4 block text-base font-medium text-gray-700"
                  >
                    באתי להקשיב
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
        </div>

        <div>
          <div className="flex justify-center mb-2">
            {error && <h3>{error}</h3>}
            {status !== "idle" && status !== "loading" && <h3>{status}</h3>}
          </div>

          <button
            type="submit"
            className="flex w-full justify-center items-center rounded-md bg-indigo-600 px-3 py-1.5 text-lg font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <p className="mx-2">התחבר</p> <Loading show={status == "loading"}/>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
