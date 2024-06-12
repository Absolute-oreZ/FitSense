import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex flex-1 xl:flex-row justify-center items-center flex-col py-10">
      {/* Content */}
      <div className="flex-1">
        <Outlet />
      </div>
      {/* Image */}
      <div className="hidden xl:flex xl:w-1/2 justify-center items-center p-20">
        <img
          src="/images/FitSense Word Cloud Light.png"
          alt="Word Cloud"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
