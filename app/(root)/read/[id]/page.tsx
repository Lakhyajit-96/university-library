"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import BookReader from "@/components/BookReader";

const ReadingPage = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      if (!session?.user?.id) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(`/api/books/${params.id}`);
        if (!response.ok) {
          throw new Error("Book not found");
        }
        
        const bookData = await response.json();
        
        // Check if user has borrowed this book and get verification status
        const borrowResponse = await fetch(`/api/borrow/check?bookId=${params.id}&userId=${session.user.id}`);
        if (!borrowResponse.ok) {
          throw new Error("You haven't borrowed this book");
        }
        
        const borrowData = await borrowResponse.json();
        
        // Check verification status
        if (borrowData.borrowRecord.verificationStatus !== 'VERIFIED') {
          throw new Error("Complete student verification to read this book");
        }
        
        setBook(bookData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    fetchBook();
  }, [session, params.id, router, status]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading book...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Book Not Found</h1>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <BookReader
        book={{
          id: book.id,
          title: book.title,
          author: book.author,
          content: book.content || "",
          coverUrl: book.coverUrl,
          coverColor: book.coverColor,
        }}
        isOpen={true}
        onClose={() => router.back()}
        onProgressUpdate={(progress) => {
          // Could save reading progress to database here
          console.log("Reading progress:", progress);
        }}
      />
    </div>
  );
};

export default ReadingPage;
