import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import BottomBar from "../../components/BottomBar";
import LeftSideBar from "../../components/LeftSideBar";


const ProtectedRootLayout = ({ user, onSignOut, children }) => {
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }
  return children ? (
    children
  ) : (
    <div className="w-full max-h-screen md:flex">
      <LeftSideBar onSignOut={onSignOut} />

      <div className="flex-1 overflow-y-auto p-5 md:ml-[270px]">
        <Outlet />
      </div>

      <BottomBar />
    </div>
  );
};

export default ProtectedRootLayout;
