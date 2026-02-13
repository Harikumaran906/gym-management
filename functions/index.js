const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.createMemberWithAccount = functions.https.onCall(async (data, context) => {
  // Must be signed in
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "You must be signed in.");
  }

  const adminUid = context.auth.uid;

  // Check caller role from Firestore (simple check)
  const adminUserSnap = await admin.firestore().collection("users").doc(adminUid).get();
  if (!adminUserSnap.exists) {
    throw new functions.https.HttpsError("permission-denied", "Role record not found for this account.");
  }

  const adminRole = adminUserSnap.data().role;
  if (adminRole !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "Only admin can create member accounts.");
  }

  // Validate inputs (simple)
  const member = data.member || {};
  const email = (data.email || "").trim();
  const password = data.password || "";

  if (!member.name || !member.phone || !member.joinDate) {
    throw new functions.https.HttpsError("invalid-argument", "Member name, phone, and join date are required.");
  }

  if (!email || !password) {
    throw new functions.https.HttpsError("invalid-argument", "Member email and password are required.");
  }

  // 1) Create member Firestore record
  const memberRef = await admin.firestore().collection("members").add({
    name: member.name,
    phone: member.phone,
    joinDate: member.joinDate,
    packageName: "",
    feeAmount: "",
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  const memberId = memberRef.id;

  // 2) Create Auth user for member
  let newUser;
  try {
    newUser = await admin.auth().createUser({
      email,
      password
    });
  } catch (err) {
    // rollback member if auth creation fails
    await admin.firestore().collection("members").doc(memberId).delete();
    throw new functions.https.HttpsError("already-exists", "Email already exists or invalid.");
  }

  const memberUid = newUser.uid;

  // 3) Create users/{uid} mapping
  await admin.firestore().collection("users").doc(memberUid).set({
    role: "member",
    memberId: memberId
  });

  // 4) Log action
  await admin.firestore().collection("logs").add({
    actionName: "CREATE_MEMBER_WITH_ACCOUNT",
    details: "Created member and login for memberId " + memberId,
    userEmail: context.auth.token.email || "",
    time: admin.firestore.FieldValue.serverTimestamp()
  });

  return { memberId, memberUid };
});