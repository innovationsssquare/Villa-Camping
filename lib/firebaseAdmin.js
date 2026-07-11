import admin from "firebase-admin";

if (!admin.apps.length) {
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL;
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, '\n');

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail,
      privateKey,
    }),
  });
}

export const verifyFirebaseIdToken = async (token) => {
  try {
    return await admin.auth().verifyIdToken(token);
  } catch (err) {
    console.error("Firebase token verification error:", err);
    return null;
  }
};
