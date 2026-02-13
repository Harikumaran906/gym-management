import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import MemberDashboard from "./pages/MemberDashboard";
import UserDashboard from "./pages/UserDashboard";

import { watchAuth } from "./services/authService";
import { setAuth, setLoading } from "./redux/authActions";

export default function App() {
  const dispatch = useDispatch();
  const { user, role, loading } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(setLoading(true));
    const unsub = watchAuth((u, r) => {
      dispatch(setAuth(u, r));
    });
    return () => unsub();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="container">
        <div className="box">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <NavBar />

      <Routes>
        <Route
          path="/"
          element={
            <div className="box">
              <h2>Home</h2>

              {!user ? (
                <div className="small">
                  Please sign in to access the application.
                </div>
              ) : (
                <div className="small">
                  You are signed in. Your role is: <b>{role}</b>.
                </div>
              )}

              <div className="small" style={{ marginTop: "10px" }}>
                Use the navigation links at the top.
              </div>
            </div>
          }
        />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/member"
          element={
            <ProtectedRoute allowRole="member">
              <MemberDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user"
          element={
            <ProtectedRoute allowRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}