import React, { useEffect ,useState} from "react";
import './App.css'
import NavBar from "./components/NavBar";
import {Routes,Route, Navigate} from 'react-router-dom'
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import SettingPage from "./pages/SettingPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore} from "./store/useAuthStore";
import {Toaster } from 'react-hot-toast'
import { useThemeStore } from "./constants/useThemeStore";


export default function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

 
  return (
    <div data-theme={theme}>
      {isCheckingAuth && !authUser ? (
        <div className="flex justify-center align-middle h-screen w-screen">
          <span className="flex justify-center align-middle loading loading-ring loading-">
            login
          </span>
        </div>
      ) : (
        <>
          <NavBar />
          <Routes>
            <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" replace />} />
            <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" replace />} />
            <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" replace />} />
            <Route path="/settings" element={authUser ? <SettingPage /> : <Navigate to="/login" replace />} />
            <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" replace />} />
          </Routes>
        </>
      )}
      <Toaster />
    </div>
  );
}
