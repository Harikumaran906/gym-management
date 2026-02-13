import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function NavBar() {
  const { user, role } = useSelector((s) => s.auth);

  return (
    <div className="box">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div>
          <b>Gym Management</b>
          <div className="small">React, Redux, Firebase</div>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link to="/">Home</Link>

          {!user && <Link to="/login">Sign In</Link>}
          {!user && <Link to="/register">Register</Link>}

          {user && role === "admin" && <Link to="/admin">Admin</Link>}
          {user && role === "member" && <Link to="/member">Member</Link>}
          {user && role === "user" && <Link to="/user">User</Link>}
        </div>
      </div>
    </div>
  );
}