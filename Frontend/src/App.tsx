// src/App.tsx
import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";

// A tiny helper to check the token is present *and* not expired
function isTokenValid(token: string) {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

// Inline PrivateRoute
function PrivateRoute({ children }: { children: ReactNode }) {
  const token = sessionStorage.getItem("token") || "";
  if (!token || !isTokenValid(token)) {
    sessionStorage.clear();
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public screens */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected home/dashboard */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Fallback: redirect everything else to "/" (which itself is protected) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
