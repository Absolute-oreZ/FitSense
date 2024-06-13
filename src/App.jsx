import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "react-toastify/dist/ReactToastify.css";

import {
  ProtectedRootLayout,
  AuthLayout,
  SigninForm,
  SignupForm,
  Home,
  Profile,
  Plans,
  Activity,
  Intake,
} from "./routes/index";
import { ToastContainer, toast } from "react-toastify";
import { auth } from "./lib/firebase/config";
import { signOut } from "./lib/firebase/api";
import { Spin } from "antd";

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null); // Update the user state to null so it will automatically redirected to sign in page
      toast.info("Sign Out Successfully!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (error) {
      toast.error("Sign Out Failed. Please Try Again!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user.uid);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Routes>
        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm setUser={setUser} />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRootLayout user={user} onSignOut={handleSignOut} />
          }
        >
          <Route index element={<Home />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/intake" element={<Intake />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
      <ToastContainer />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
