import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <p className="ml-2 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {user && <SideMenu activeMenu={activeMenu} />}
      <div className="flex-1 bg-[#f5f6fa] p-5 overflow-y-auto">
        <Navbar activeMenu={activeMenu} />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
