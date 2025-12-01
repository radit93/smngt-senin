// src/components/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function AdminRoute({ children }) {
  const { user, profile, loading, profileLoading } = useAuth();

  // 1. Kalau auth atau profile masih loading → jangan ngapa-ngapain dulu
  if (loading || profileLoading) {
    return <p className="p-6">Loading...</p>;
  }

  // 2. Kalau tidak ada user → suruh login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Kalau profile BELUM TERLOAD tapi user ada → jangan redirect
  if (!profile) {
    return <p className="p-6">Loading profile...</p>;
  }

  // 4. Jika role bukan admin → tolak
  if (profile.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}