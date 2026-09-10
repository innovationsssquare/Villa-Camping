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

    const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT secret is not configured");
      return Response.json(
        { error: "Authentication is not configured" },
        { status: 500 }
      );
    }

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

    await connectDB();

    const dbUser = await User.findById(decoded.id || user._id)
      .select(PUBLIC_USER_FIELDS)
      .lean();

    if (!dbUser) {
      return Response.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, user: dbUser, token });
  } catch (err) {
    console.error("Login API route error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
