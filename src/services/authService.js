import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { logAction } from "./logService";

export function watchAuth(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback(null, null);
      return;
    }

    let role = "user";

    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        role = snap.data().role || "user";
      }
    } catch (err) {
      console.log("Failed to read role", err);
    }

    callback(user, role);
  });
}

export async function login(email, password) {
  const res = await signInWithEmailAndPassword(auth, email, password);
  await logAction("LOGIN", "User signed in", email);
  return res.user;
}

export async function logout(email) {
  await signOut(auth);
  await logAction("LOGOUT", "User signed out", email);
}

export async function registerUser(email, password, userData) {
  const res = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", res.user.uid), userData);

  await logAction("REGISTER", "User registered with role " + userData.role, email);
  return res.user;
}