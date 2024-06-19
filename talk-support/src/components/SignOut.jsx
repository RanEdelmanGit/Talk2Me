
import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase_config";
import { useUser } from "../context/userContext";

export default function SignOut() {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return <button onClick={() => signOut(auth)} className="logout">Sign Out</button>;
}
