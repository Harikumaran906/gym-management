import { db } from "../firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { logAction } from "./logService";

export async function addMember(member, adminEmail) {
  const ref = await addDoc(collection(db, "members"), {
    ...member,
    createdAt: serverTimestamp(),
  });

  await logAction("ADD_MEMBER", "Added member: " + member.name, adminEmail);
  return ref.id;
}

export async function updateMember(memberId, member, adminEmail) {
  await updateDoc(doc(db, "members", memberId), member);
  await logAction("UPDATE_MEMBER", "Updated member: " + memberId, adminEmail);
}

export async function deleteMember(memberId, adminEmail) {
  await deleteDoc(doc(db, "members", memberId));
  await logAction("DELETE_MEMBER", "Deleted member: " + memberId, adminEmail);
}

export async function getAllMembers() {
  const snap = await getDocs(collection(db, "members"));
  const list = [];
  snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
  return list;
}

export async function getMemberById(memberId) {
  const snap = await getDoc(doc(db, "members", memberId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function assignPackage(memberId, packageName, feeAmount, adminEmail) {
  await updateDoc(doc(db, "members", memberId), {
    packageName: packageName,
    feeAmount: feeAmount,
  });

  await logAction(
    "ASSIGN_PACKAGE",
    "Assigned package " + packageName + " to member " + memberId,
    adminEmail
  );
}

export async function createBill(bill, adminEmail) {
  await addDoc(collection(db, "bills"), {
    ...bill,
    createdAt: serverTimestamp(),
  });

  await logAction(
    "CREATE_BILL",
    "Created bill for member " + bill.memberId,
    adminEmail
  );
}

export async function getBillsByMemberId(memberId) {
  const q = query(collection(db, "bills"), where("memberId", "==", memberId));
  const snap = await getDocs(q);
  const list = [];
  snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
  return list;
}

export async function sendMonthlyNotification(text, adminEmail) {
  await addDoc(collection(db, "notifications"), {
    text: text,
    createdAt: serverTimestamp(),
  });

  await logAction(
    "SEND_NOTIFICATION",
    "Sent a notification",
    adminEmail
  );
}

export async function getAllNotifications() {
  const snap = await getDocs(collection(db, "notifications"));
  const list = [];
  snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
  return list;
}

export async function validateMemberLink(memberId, phone) {
  try {
    const snap = await getDoc(doc(db, "members", memberId));
    if (!snap.exists()) return false;

    const data = snap.data();

    const dbPhone = (data.phone || "").toString().trim();
    const inputPhone = (phone || "").toString().trim();

    return dbPhone === inputPhone;
  } catch (err) {
    console.log(err);
    return false;
  }
}