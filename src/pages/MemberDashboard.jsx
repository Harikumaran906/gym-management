import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { logout } from "../services/authService";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { getBillsByMemberId, getAllNotifications } from "../services/gymService";

export default function MemberDashboard() {
  const { user } = useSelector((s) => s.auth);

  const [memberId, setMemberId] = useState("");
  const [bills, setBills] = useState([]);
  const [notes, setNotes] = useState([]);
  const [msg, setMsg] = useState("");

  async function loadMemberId() {
    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) {
        setMsg("Role record not found in users collection.");
        return;
      }
      setMemberId(snap.data().memberId || "");
    } catch (err) {
      console.log(err);
      setMsg("Failed to load member details.");
    }
  }

  async function loadData(mid) {
    if (!mid) {
      setMsg("memberId is not set for this account.");
      return;
    }

    const b = await getBillsByMemberId(mid);
    const n = await getAllNotifications();
    setBills(b);
    setNotes(n);
  }

  useEffect(() => {
    loadMemberId();
  }, []);

  useEffect(() => {
    if (memberId) loadData(memberId);
  }, [memberId]);

  async function handleLogout() {
    await logout(user.email);
  }

  return (
    <div className="container">
      <div className="box">
        <h2>Member Dashboard</h2>
        <div className="small">Signed in as: {user?.email}</div>

        <button onClick={handleLogout} style={{ marginTop: "10px" }}>
          Sign Out
        </button>

        {msg && <div className="box">{msg}</div>}

        <hr className="hr" />

        <div className="box">
          <h3>Bill Receipts</h3>

          {!memberId ? (
            <div className="small">Member information is not configured.</div>
          ) : bills.length === 0 ? (
            <div>No receipts found.</div>
          ) : (
            bills.map((b) => (
              <div className="box" key={b.id}>
                <div>
                  <b>Month:</b> {b.month}
                </div>
                <div>
                  <b>Amount:</b> {b.amount}
                </div>
                <div className="small">Member ID: {b.memberId}</div>
              </div>
            ))
          )}
        </div>

        <div className="box">
          <h3>Notifications</h3>

          {notes.length === 0 ? (
            <div>No notifications available.</div>
          ) : (
            notes.map((n) => (
              <div className="box" key={n.id}>
                {n.text}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}