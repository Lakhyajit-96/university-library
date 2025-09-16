import React from "react";
import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { users, books, borrowRecords } from "@/database/schema";
import { eq, and, desc } from "drizzle-orm";
import Image from "next/image";
import ProfilePageClient from "@/components/ProfilePageClient";
import { LoadingSkeleton, ErrorState } from "@/components/ProfileLoadingStates";
import { Suspense } from "react";
import dayjs from "dayjs";

interface BorrowedBook extends Book {
  borrowedDate: string;
  dueDate: string;
  status: 'borrowed' | 'overdue' | 'returned';
  verificationStatus?: 'VERIFIED' | 'UNVERIFIED' | 'PENDING_VERIFICATION' | 'REJECTED';
}

const Page = async () => {
  const session = await auth();
  
  if (!session?.user?.id) {
    return <div>Please sign in to view your profile</div>;
  }

  // Get user data from database
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user) {
    return <div>User not found</div>;
  }

  // Fetch real borrowed books from database
  let borrowedBooks: BorrowedBook[] = [];
  
  try {
    console.log('Fetching borrowed books for user:', session.user.id);
    
    const borrowedRecords = await db
      .select({
        book: books,
        borrowRecord: borrowRecords,
      })
      .from(borrowRecords)
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .where(eq(borrowRecords.userId, session.user.id))
      .orderBy(desc(borrowRecords.borrowDate));

    console.log('Found borrowed records:', borrowedRecords.length);

    // Transform the data to match the BorrowedBook interface
    borrowedBooks = borrowedRecords.map((record) => {
      const book = record.book;
      const borrowRecord = record.borrowRecord;
      
      console.log('Book cover URL:', book.coverUrl);
      console.log('Book title:', book.title);
      console.log('Book cover color:', book.coverColor);
      
      // Calculate status based on due date and return date
      let status: 'borrowed' | 'overdue' | 'returned' = 'borrowed';
      let dueDateText = '';
      
      if (borrowRecord.status === 'RETURNED' && borrowRecord.returnDate) {
        status = 'returned';
        dueDateText = `Returned on ${dayjs(borrowRecord.returnDate).format('MMM DD')}`;
      } else {
        const daysUntilDue = dayjs(borrowRecord.dueDate).diff(dayjs(), 'days');
        if (daysUntilDue < 0) {
          status = 'overdue';
          dueDateText = 'Overdue Return';
        } else {
          status = 'borrowed';
          dueDateText = `${daysUntilDue} days left to due`;
        }
      }

      return {
        id: book.id,
        title: book.title,
        author: book.author,
        genre: book.genre,
        rating: book.rating,
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
        description: book.description,
        coverColor: book.coverColor,
        coverUrl: book.coverUrl, // Pass the original path for BookCover component
        videoUrl: book.videoUrl,
        summary: book.summary,
        createdAt: book.createdAt,
        borrowedDate: dayjs(borrowRecord.borrowDate).format('MMM DD'),
        dueDate: dueDateText,
        status,
        verificationStatus: borrowRecord.verificationStatus || 'UNVERIFIED',
        borrowRecordId: borrowRecord.id, // Add the borrow record ID
      };
    });
    
    console.log('Processed borrowed books:', borrowedBooks.length);
  } catch (error) {
    console.error('Error fetching borrowed books:', error);
    // Fallback to empty array if there's an error
    borrowedBooks = [];
  }


  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ProfilePageClient user={user as any} borrowedBooks={borrowedBooks} />
    </Suspense>
  );
};

export default Page;
