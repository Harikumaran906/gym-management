import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { logout } from "../services/authService";
import { getAllMembers } from "../services/gymService";

export default function UserDashboard() {
  const { user } = useSelector((s) => s.auth);

  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function run() {
      const list = await getAllMembers();
      setMembers(list);
    }
    run();
  }, []);

  async function handleLogout() {
    await logout(user.email);
  }

  const filtered = members.filter((m) =>
    (m.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <div className="box">
        <h2>User Dashboard</h2>
        <div className="small">Signed in as: {user?.email}</div>

        <button onClick={handleLogout} style={{ marginTop: "10px" }}>
          Sign Out
        </button>

        <hr className="hr" />

        <div className="box">
          <h3>Search Members</h3>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Enter member name"
          />
        </div>

        <div className="box">
          <h3>Members</h3>

          {filtered.length === 0 ? (
            <div>No matching members found.</div>
          ) : (
            filtered.map((m) => (
              <div key={m.id} className="box">
                <b>{m.name}</b>
                <div className="small">Phone: {m.phone}</div>
                <div className="small">Package: {m.packageName || "-"}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}