import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export async function logAction(actionName, details, userEmail) {
  try {
    console.log("[LOG]", actionName, details, userEmail);

    await addDoc(collection(db, "logs"), {
      actionName: actionName,
      details: details || "",
      userEmail: userEmail || "",
      time: serverTimestamp(),
    });
  } catch (err) {
    console.log("Log write failed", err);
  }
}