import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, allowRole }) {
  const { user, role, loading } = useSelector((s) => s.auth);

  if (loading) return <div className="container">Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  if (allowRole && role !== allowRole) {
    return (
      <div className="container">
        <div className="box">
          Access denied. You do not have permission to view this page.
        </div>
      </div>
    );
  }

  return children;
}