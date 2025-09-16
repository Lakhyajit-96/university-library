import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { borrowRecords } from "@/database/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");
    const userId = searchParams.get("userId");

    if (!bookId || !userId) {
      return NextResponse.json(
        { error: "Missing bookId or userId" },
        { status: 400 }
      );
    }

    const [borrowRecord] = await db
      .select()
      .from(borrowRecords)
      .where(
        and(
          eq(borrowRecords.userId, userId),
          eq(borrowRecords.bookId, bookId),
          eq(borrowRecords.status, "BORROWED")
        )
      )
      .limit(1);

    if (!borrowRecord) {
      return NextResponse.json(
        { error: "Book not borrowed by user" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, borrowRecord });
  } catch (error) {
    console.error("Error checking borrow record:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
