import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setMsg("");

    try {
      await login(email, password);
      setMsg("Sign in successful.");
      navigate("/");
    } catch (err) {
      console.log(err);
      setMsg("Sign in failed. Please verify email and password.");
    }
  }

  return (
    <div className="container">
      <div className="box">
        <h2>Sign In</h2>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" style={{ marginTop: "10px" }}>
            Sign In
          </button>
        </form>

        {msg && <div className="box">{msg}</div>}

        
      </div>
    </div>
  );
}