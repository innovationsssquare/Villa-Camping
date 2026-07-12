import connectDB from "@/lib/dbConnect";
import User from "@/Model/Userschema";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { token, user } = await req.json();

    if (!token || !user) {
      return new Response(JSON.stringify({ error: "Token and user details are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify token using same secret as backend
    const secret = process.env.NEXTAUTH_SECRET || "PAVAN2585";
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      console.error("JWT verification failed in Next.js login API:", err.message);
      return new Response(JSON.stringify({ error: "Invalid or expired session token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectDB();

    const dbUser = await User.findById(decoded.id || user._id);
    if (!dbUser) {
      return new Response(JSON.stringify({ error: "User not found in database" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return Response.json({ success: true, user: dbUser, token });
  } catch (err) {
    console.error("Login API route error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
