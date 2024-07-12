import React from "react";
import { useSelector } from "react-redux";
import Header from "../components/layout/Header";

import SupportersPage from "./SupportersPage";
import ClientsPage from "./ClientsPage";

const ClientsSupportersPage = () => {
  
  const { userType, user } = useSelector((state) => state.auth);

 


  return (
    <>
      {user.uid && <Header />}
      <div className="min-h-screen flex flex-col md:flex-row mt-16" dir="rtl">
        {userType === "client" && (
          <SupportersPage />
        )}
        {userType === "supporter" && <ClientsPage />}
      </div>
    </>
  );
};

export default ClientsSupportersPage;
