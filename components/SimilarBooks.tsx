import React from "react";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq, ne } from "drizzle-orm";
import BookCover from "@/components/BookCover";
import Link from "next/link";

interface Props {
  currentBookId: string;
  genre: string;
}

const SimilarBooks = async ({ currentBookId, genre }: Props) => {
  // Fetch books with the same genre, excluding the current book
  const similarBooks = await db
    .select()
    .from(books)
    .where(eq(books.genre, genre))
    .limit(6);

  // Filter out the current book
  const filteredBooks = similarBooks.filter(book => book.id !== currentBookId);

  // If we don't have enough books in the same genre, fetch some random books
  if (filteredBooks.length < 6) {
    const additionalBooks = await db
      .select()
      .from(books)
      .where(ne(books.id, currentBookId))
      .limit(6 - filteredBooks.length);
    
    // Add additional books while avoiding duplicates
    additionalBooks.forEach(book => {
      if (!filteredBooks.some(existingBook => existingBook.id === book.id)) {
        filteredBooks.push(book);
      }
    });
  }

  return (
    <section className="flex flex-col gap-7">
      <h3>More similar books</h3>
      
      <div className="similar-books-container">
        {filteredBooks.slice(0, 6).map((book) => (
          <Link key={book.id} href={`/books/${book.id}`} className="similar-book-item">
            <BookCover variant="medium" className="book-3d-similar" coverColor={book.coverColor} coverImage={book.coverUrl} />
            <div className="mt-4 text-center">
              <p className="book-title">{book.title}</p>
              <p className="book-genre">{book.genre}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SimilarBooks;
