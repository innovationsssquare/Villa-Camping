import { verifyFirebaseIdToken } from "@/lib/firebaseAdmin";
import connectDB from "@/lib/dbConnect";
import User from "@/Model/Userschema";

export async function POST(req) {
  const { idToken } = await req.json();

  const decoded = await verifyFirebaseIdToken(idToken);
  if (!decoded) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
    });
  }

  const { uid, email, name, picture, firebase } = decoded;

  await connectDB();

  let user = await User.findOne({ firebaseUID: uid });
  if (!user) {
    user = await User.create({
      firebaseUID: uid,
      email,
      fullName: name,
      profilePic: picture,
      providerAccountId: firebase?.sign_in_provider || "custom",
    });
  }

  return Response.json({ success: true, user: user, token: idToken });
}
