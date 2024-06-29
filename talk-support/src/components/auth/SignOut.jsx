import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase_config";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../redux/features/authSlice";

export default function SignOut() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      navigate("/login");
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user.id) {
    navigate("/login");
    return null;
  }

  return <button onClick={handleSignOut} className="text-white hover:text-red-500">יציאה</button>;
}
