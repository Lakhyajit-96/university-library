"use server";

import { db } from "@/database/drizzle";
import { borrowRecords, books, users } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import dayjs from "dayjs";

export const borrowBook = async (params: BorrowBookParams) => {
  const { userId, bookId } = params;

  try {
    // Check user verification status
    const user = await db
      .select({ verificationStatus: users.verificationStatus })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const book = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book.length || book[0].availableCopies <= 0) {
      return {
        success: false,
        error: "Book is not available for borrowing",
      };
    }

    const dueDate = dayjs().add(7, "day").toDate().toDateString();

    // Determine verification status for the borrow record
    const verificationStatus = user[0].verificationStatus === "VERIFIED" ? "VERIFIED" : "UNVERIFIED";

    const record = await db.insert(borrowRecords).values({
      userId,
      bookId,
      dueDate,
      status: "BORROWED",
      verificationStatus: verificationStatus,
    });

    await db
      .update(books)
      .set({ availableCopies: book[0].availableCopies - 1 })
      .where(eq(books.id, bookId));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(record)),
      verificationStatus: verificationStatus,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "An error occurred while borrowing the book",
    };
  }
};

export const returnBook = async (borrowRecordId: string) => {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    // Find the borrow record by ID and verify it belongs to the user
    const [borrowRecord] = await db
      .select()
      .from(borrowRecords)
      .where(
        and(
          eq(borrowRecords.id, borrowRecordId),
          eq(borrowRecords.userId, session.user.id),
          eq(borrowRecords.status, "BORROWED")
        )
      )
      .limit(1);

    if (!borrowRecord) {
      return {
        success: false,
        error: "No active borrow record found for this book",
      };
    }

    // Update the borrow record
    await db
      .update(borrowRecords)
      .set({
        status: "RETURNED",
        returnDate: dayjs().format("YYYY-MM-DD"),
      })
      .where(eq(borrowRecords.id, borrowRecord.id));

    // Update book availability
    const [book] = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, borrowRecord.bookId))
      .limit(1);

    if (book) {
      await db
        .update(books)
        .set({ availableCopies: book.availableCopies + 1 })
        .where(eq(books.id, borrowRecord.bookId));
    }

    return {
      success: true,
      data: { returnDate: dayjs().format("YYYY-MM-DD") },
    };
  } catch (error) {
    console.error("Error returning book:", error);
    return {
      success: false,
      error: "Failed to return book",
    };
  }
};