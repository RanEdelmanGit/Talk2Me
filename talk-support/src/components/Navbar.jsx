import React from "react";
import SignOut from "./SignOut";
import { useUser } from "../context/userContext";

export default function Navbar() {
  const { user } = useUser();
  return (
    <div className="navbar">
      <span className="chatlogo">chat app</span>
      <span>{user.displayName}</span>
      <SignOut />
    </div>
  );
}
