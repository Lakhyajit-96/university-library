import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // For now, we'll use a placeholder URL. In production, you'd upload to:
    // - AWS S3
    // - Cloudinary
    // - ImageKit
    // - Or any other cloud storage service
    
    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `profile-${userId}-${timestamp}.${file.name.split('.').pop()}`;
    
    // Convert the uploaded file to a data URL
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || 'image/jpeg';
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;
    
    const imageUrl = dataUrl;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Profile picture upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
