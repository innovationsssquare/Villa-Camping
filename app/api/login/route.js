import connectDB from "@/lib/dbConnect";
import User from "@/Model/Userschema";
import jwt from "jsonwebtoken";

const PUBLIC_USER_FIELDS = "fullName email mobile profilePic";

export async function POST(req) {
  try {
    const { token, user } = await req.json();

    if (!token || !user) {
      return Response.json(
        { error: "Token and user details are required" },
        { status: 400 }
      );
    }

    const secret =
      process.env.NEXTAUTH_SECRET ||
      process.env.JWT_SECRET ||
      process.env.JWT_SECRECT ||
      "PAVAN2585";

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      console.error("JWT verification failed in Next.js login API:", err.message);
      return Response.json(
        { error: "Invalid or expired session token" },
        { status: 401 }
      );
    }

    let dbUser = user;
    try {
      await connectDB();
      const targetId = decoded?.id || user?._id;
      if (targetId) {
        const found = await User.findById(targetId)
          .select(PUBLIC_USER_FIELDS)
          .lean();
        if (found) {
          dbUser = { ...user, ...found };
        }
      }
    } catch (dbErr) {
      console.warn("MongoDB user query in Next.js login skipped:", dbErr.message);
    }

    return Response.json({ success: true, user: dbUser, token });
  } catch (err) {
    console.error("Login API route error:", err);
    return Response.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
