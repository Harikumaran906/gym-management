import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  addMember,
  updateMember,
  deleteMember,
  getAllMembers,
  assignPackage,
  createBill,
  sendMonthlyNotification,
} from "../services/gymService";

import { logout } from "../services/authService";

export default function AdminDashboard() {
  const { user } = useSelector((s) => s.auth);

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [msg, setMsg] = useState("");

  // Add member
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [joinDate, setJoinDate] = useState("");

  // Edit member
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  // Package
  const [pkgMemberId, setPkgMemberId] = useState("");
  const [pkgName, setPkgName] = useState("Monthly");
  const [pkgFee, setPkgFee] = useState("1000");

  // Bill
  const [billMemberId, setBillMemberId] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [billMonth, setBillMonth] = useState("");

  // Notification
  const [noteText, setNoteText] = useState("");

  async function refresh() {
    setLoading(true);
    const list = await getAllMembers();
    setMembers(list);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleAddMember(e) {
    e.preventDefault();
    setMsg("");

    try {
      await addMember(
        {
          name,
          phone,
          joinDate,
          packageName: "",
          feeAmount: "",
        },
        user.email
      );

      setName("");
      setPhone("");
      setJoinDate("");
      setMsg("Member created successfully.");
      refresh();
    } catch (err) {
      console.log(err);
      setMsg("Failed to create member.");
    }
  }

  function startEdit(m) {
    setEditId(m.id);
    setEditName(m.name || "");
    setEditPhone(m.phone || "");
  }

  async function handleUpdateMember(e) {
    e.preventDefault();
    setMsg("");

    try {
      await updateMember(
        editId,
        { name: editName, phone: editPhone },
        user.email
      );

      setEditId("");
      setEditName("");
      setEditPhone("");
      setMsg("Member updated successfully.");
      refresh();
    } catch (err) {
      console.log(err);
      setMsg("Failed to update member.");
    }
  }

  async function handleDeleteMember(id) {
    const ok = confirm("Are you sure you want to delete this member?");
    if (!ok) return;

    setMsg("");
    try {
      await deleteMember(id, user.email);
      setMsg("Member deleted successfully.");
      refresh();
    } catch (err) {
      console.log(err);
      setMsg("Failed to delete member.");
    }
  }

  async function handleAssignPackage(e) {
    e.preventDefault();
    setMsg("");

    try {
      await assignPackage(pkgMemberId, pkgName, pkgFee, user.email);
      setMsg("Package assigned successfully.");
      refresh();
    } catch (err) {
      console.log(err);
      setMsg("Failed to assign package.");
    }
  }

  async function handleCreateBill(e) {
    e.preventDefault();
    setMsg("");

    try {
      await createBill(
        {
          memberId: billMemberId,
          amount: billAmount,
          month: billMonth,
        },
        user.email
      );

      setMsg("Bill receipt created successfully.");
      setBillMemberId("");
      setBillAmount("");
      setBillMonth("");
    } catch (err) {
      console.log(err);
      setMsg("Failed to create bill receipt.");
    }
  }

  async function handleNotification(e) {
    e.preventDefault();
    setMsg("");

    try {
      await sendMonthlyNotification(noteText, user.email);
      setMsg("Notification sent successfully.");
      setNoteText("");
    } catch (err) {
      console.log(err);
      setMsg("Failed to send notification.");
    }
  }

  function exportCSV() {
    const headers = [
      "id",
      "name",
      "phone",
      "joinDate",
      "packageName",
      "feeAmount",
    ];

    let csv = headers.join(",") + "\n";

    for (let m of members) {
      const row = [
        m.id,
        (m.name || "").replaceAll(",", " "),
        (m.phone || "").replaceAll(",", " "),
        (m.joinDate || "").replaceAll(",", " "),
        (m.packageName || "").replaceAll(",", " "),
        (m.feeAmount || "").replaceAll(",", " "),
      ];
      csv += row.join(",") + "\n";
    }

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "members_report.csv";
    a.click();

    URL.revokeObjectURL(url);
  }

  async function handleLogout() {
    await logout(user.email);
  }

  return (
    <div className="container">
      <div className="box">
        <h2>Admin Dashboard</h2>
        <div className="small">Signed in as: {user?.email}</div>

        <button onClick={handleLogout} style={{ marginTop: "10px" }}>
          Sign Out
        </button>

        {msg && <div className="box">{msg}</div>}

        <hr className="hr" />

        <div className="row">
          <div className="box">
            <h3>Create Member</h3>

            <form onSubmit={handleAddMember}>
              <label>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />

              <label>Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <label>Join Date</label>
              <input
                type="date"
                value={joinDate}
                onChange={(e) => setJoinDate(e.target.value)}
              />

              <button type="submit" style={{ marginTop: "10px" }}>
                Create
              </button>
            </form>
          </div>

          <div className="box">
            <h3>Update Member</h3>

            {!editId ? (
              <div className="small">
                Select a member from the list and click Edit.
              </div>
            ) : (
              <form onSubmit={handleUpdateMember}>
                <div className="small">Editing Member ID: {editId}</div>

                <label>Name</label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />

                <label>Phone</label>
                <input
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                />

                <button type="submit" style={{ marginTop: "10px" }}>
                  Update
                </button>

                <button
                  type="button"
                  onClick={() => setEditId("")}
                  style={{ marginTop: "10px" }}
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>

        <hr className="hr" />

        <div className="row">
          <div className="box">
            <h3>Assign Package</h3>

            <form onSubmit={handleAssignPackage}>
              <label>Member</label>
              <select
                value={pkgMemberId}
                onChange={(e) => setPkgMemberId(e.target.value)}
              >
                <option value="">Select member</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.id})
                  </option>
                ))}
              </select>

              <label>Package Name</label>
              <select
                value={pkgName}
                onChange={(e) => setPkgName(e.target.value)}
              >
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Yearly</option>
              </select>

              <label>Fee Amount</label>
              <input value={pkgFee} onChange={(e) => setPkgFee(e.target.value)} />

              <button type="submit" style={{ marginTop: "10px" }}>
                Assign
              </button>
            </form>
          </div>

          <div className="box">
            <h3>Create Bill Receipt</h3>

            <form onSubmit={handleCreateBill}>
              <label>Member</label>
              <select
                value={billMemberId}
                onChange={(e) => setBillMemberId(e.target.value)}
              >
                <option value="">Select member</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.id})
                  </option>
                ))}
              </select>

              <label>Month</label>
              <input
                value={billMonth}
                onChange={(e) => setBillMonth(e.target.value)}
                placeholder="Jan 2026"
              />

              <label>Amount Paid</label>
              <input
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                placeholder="1000"
              />

              <button type="submit" style={{ marginTop: "10px" }}>
                Create
              </button>
            </form>
          </div>
        </div>

        <hr className="hr" />

        <div className="row">
          <div className="box">
            <h3>Send Notification</h3>

            <form onSubmit={handleNotification}>
              <label>Message</label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={4}
              />

              <button type="submit" style={{ marginTop: "10px" }}>
                Send
              </button>
            </form>
          </div>

          <div className="box">
            <h3>Export Report</h3>
            <div className="small">
              Exports all members into a CSV file.
            </div>

            <button onClick={exportCSV} style={{ marginTop: "10px" }}>
              Download CSV
            </button>
          </div>
        </div>

        <hr className="hr" />

        <div className="box">
          <h3>Members</h3>

          {loading ? (
            <div>Loading...</div>
          ) : members.length === 0 ? (
            <div>No members found.</div>
          ) : (
            members.map((m) => (
              <div key={m.id} className="box">
                <b>{m.name}</b>
                <div className="small">Member ID: {m.id}</div>

                <div className="small">Phone: {m.phone}</div>
                <div className="small">Join Date: {m.joinDate}</div>
                
                <div className="small">
                  Package: {m.packageName || "-"} | Fee: {m.feeAmount || "-"}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <button onClick={() => startEdit(m)}>Edit</button>
                  <button onClick={() => handleDeleteMember(m.id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="box">
          <h3>Supplement Store and Diet Details</h3>
          <div className="small">
            This section can be added later. The current version focuses on core
            management functions.
          </div>
        </div>
      </div>
    </div>
  );
}