import cloudinary from "@/lib/cloudinary";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const MAX_DATA_URL_LENGTH = 8_000_000;

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { file } = await req.json();
    if (!file || typeof file !== "string") {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.startsWith("data:image/") || file.length > MAX_DATA_URL_LENGTH) {
      return Response.json({ error: "Invalid image upload" }, { status: 400 });
    }

    const result = await cloudinary.uploader.upload(file, {
      folder: "reviews",
      resource_type: "image",
    });

    return Response.json({ success: true, url: result.secure_url });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
