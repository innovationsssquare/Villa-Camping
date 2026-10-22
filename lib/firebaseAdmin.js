import admin from "firebase-admin";

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_PRIVATE_KEY || "";
  const privateKey = rawKey.replace(/\\n/g, '\n').replace(/^"|"$/g, "");

  if (clientEmail && privateKey) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } catch (initErr) {
      console.error("Firebase Admin initialization error:", initErr);
    }
  } else {
    console.warn("Firebase Admin credentials not configured (FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY missing)");
  }
}

export const verifyFirebaseIdToken = async (token) => {
  try {
    return await admin.auth().verifyIdToken(token);
  } catch (err) {
    console.error("Firebase token verification error:", err);
    return null;
  }
};
