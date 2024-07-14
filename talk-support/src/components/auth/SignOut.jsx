import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase_config";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../redux/features/authSlice";
import { logoutChat } from "../../redux/features/chatSlice";

export default function SignOut() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      dispatch(logoutChat());
      localStorage.removeItem("userType");
      navigate("/welcome");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };


  return (
    <button
      onClick={handleSignOut}
      className="text-white flex items-center justify-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-7 text-gray-700"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
        />
      </svg>
    </button>
  );
}
