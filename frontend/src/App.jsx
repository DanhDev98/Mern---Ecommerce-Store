import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import LoadingSpinner from "./components/LoadingSpinner";
import DashboardPage from "./pages/DashboardPage";
const App = () => {
  const { user, checkAuth, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }
  return (
    <div className="h-full  bg-gray-900 text-white relative  ">
      <div className="absolute inset-0 overflow-hidden ">
        <div className="absolute inset-0  z-0 ">
          <div className="absolute top-0 left-0.5 -translate-x-0.5 w-full h-full bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 ... "></div>
        </div>
      </div>
      <div className="z-20 pt-20 absolute flex flex-col w-full min-h-screen  ">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/signup"
            element={!user ? <SignUpPage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to={"/"} />}
          />
          <Route path="/secret-dashboard" element={<DashboardPage />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
};

export default App;
