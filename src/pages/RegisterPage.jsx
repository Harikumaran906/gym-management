import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { validateMemberLink } from "../services/gymService";

export default function RegisterPage() {
  const [type, setType] = useState("user"); // user | member

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // member linking
  const [memberId, setMemberId] = useState("");
  const [phone, setPhone] = useState("");

  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setMsg("");

    if (!email || !password) {
      setMsg("Email and password are required.");
      return;
    }

    try {
      if (type === "member") {
        if (!memberId || !phone) {
          setMsg("Member ID and phone are required for member registration.");
          return;
        }

        const ok = await validateMemberLink(memberId.trim(), phone.trim());
        if (!ok) {
          setMsg("Member verification failed. Please check Member ID and phone.");
          return;
        }

        await registerUser(email.trim(), password, {
          role: "member",
          memberId: memberId.trim(),
        });

        setMsg("Member account created successfully. Please sign in.");
        navigate("/login");
        return;
      }

      // normal user
      await registerUser(email.trim(), password, { role: "user" });
      setMsg("User account created successfully. Please sign in.");
      navigate("/login");
    } catch (err) {
      console.log(err);
      setMsg("Registration failed. The email may already be in use.");
    }
  }

  return (
    <div className="container">
      <div className="box">
        <h2>Register</h2>

        <form onSubmit={handleRegister}>
          <label>Account Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="user">User</option>
            <option value="member">Member</option>
          </select>

          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {type === "member" && (
            <>
              <hr className="hr" />

              <label>Member ID</label>
              <input
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                placeholder="Copy from admin member list"
              />

              <label>Phone (must match member record)</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Same phone used by admin"
              />
            </>
          )}

          <button type="submit" style={{ marginTop: "10px" }}>
            Create Account
          </button>
        </form>

        {msg && <div className="box">{msg}</div>}

        <div className="small" style={{ marginTop: "10px" }}>
          Admin accounts are created separately. Members can register only after
          the admin creates their member record.
        </div>
      </div>
    </div>
  );
}