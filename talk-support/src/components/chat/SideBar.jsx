import React from "react";
import Navbar from "../layout/Navbar";
import Search from "./Search";
import Chats from "./Chats";

export default function SideBar() {
  return (
    <div className="sidebar">
      <Navbar />
      <Search />
      <Chats />
    </div>
  );
}
