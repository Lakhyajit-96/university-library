"use client";

import React from "react";
import BookCover from "@/components/BookCover";
import Image from "next/image";
import Link from "next/link";
import generateReceiptPDF from "@/lib/utils/pdfReceipt";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

interface BorrowedBookCardProps {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverColor: string;
  coverUrl: string;
  borrowedDate: string;
  dueDate: string;
  status: 'borrowed' | 'overdue' | 'returned';
  verificationStatus?: 'VERIFIED' | 'UNVERIFIED' | 'PENDING_VERIFICATION' | 'REJECTED';
  borrowRecordId?: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
    studentId?: string;
    department?: string;
  };
  onBookClick: () => void;
  onReturnBook: () => void;
}

const BorrowedBookCard = ({
  id,
  title,
  author,
  genre,
  coverColor,
  coverUrl,
  borrowedDate,
  dueDate,
  status,
  verificationStatus = 'UNVERIFIED',
  borrowRecordId,
  user,
  onBookClick,
  onReturnBook,
}: BorrowedBookCardProps) => {
  // Extract the path from the full ImageKit URL for BookCover component
  const coverImagePath = coverUrl?.startsWith('https://ik.imagekit.io/lclakhyajit') 
    ? coverUrl.replace('https://ik.imagekit.io/lclakhyajit', '')
    : coverUrl;

  const handleDownloadReceipt = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Error",
        description: "User information not available",
        variant: "destructive",
      });
      return;
    }

    try {
      await generateReceiptPDF({
        book: {
          id,
          title,
          author,
          genre,
          coverUrl,
          borrowedDate,
          dueDate,
          status: status.toUpperCase(),
        },
        user,
        borrowRecord: {
          id: borrowRecordId || id,
          borrowDate: borrowedDate,
          dueDate: dueDate,
          status: status.toUpperCase(),
        },
      });

      toast({
        title: "Success",
        description: "Receipt downloaded successfully!",
      });
    } catch (error) {
      console.error("Error generating receipt:", error);
      toast({
        title: "Error",
        description: "Failed to generate receipt. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
  <li className="xs:w-52 w-full">
    <div 
      className="borrowed-book-card cursor-pointer"
      onClick={onBookClick}
      style={{ backgroundColor: '#2A2A2A' }} // Dark card background
    >
        {/* Book cover with matching background color */}
        <div 
          className="book-cover-section"
          style={{ backgroundColor: coverColor }}
        >
          <BookCover 
            className="book-3d-effect" 
            coverColor={coverColor} 
            coverImage={coverImagePath} 
          />
        </div>

      {/* Book details */}
      <div className="borrowed-book-details">
        <h3 className="book-title">{title}</h3>
        <p className="book-author">By {author}</p>
        <p className="book-category">{genre}</p>
        
        {/* Borrowed date */}
        <div className="book-info-row">
          <Image
            src="/icons/book.svg"
            alt="book"
            width={16}
            height={16}
            className="book-icon"
          />
          <span className="borrowed-date">Borrowed on {borrowedDate}</span>
        </div>

        {/* Due date with status */}
        <div className="book-info-row">
          {status === 'overdue' ? (
            <>
              <Image
                src="/icons/warning.svg"
                alt="warning"
                width={16}
                height={16}
                className="book-icon warning-icon"
              />
              <span className="due-date overdue">Overdue Return</span>
            </>
          ) : status === 'returned' ? (
            <>
              <Image
                src="/icons/check.svg"
                alt="returned"
                width={16}
                height={16}
                className="book-icon success-icon"
              />
              <span className="due-date returned">Returned on {dueDate}</span>
            </>
          ) : (
            <>
              <Image
                src="/icons/calendar.svg"
                alt="calendar"
                width={16}
                height={16}
                className="book-icon"
              />
              <span className="due-date">{dueDate} left to due</span>
            </>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="book-actions">
        <div className="flex items-center gap-2">
          {status === 'borrowed' && (
            <>
              {verificationStatus === 'VERIFIED' ? (
                <Link href={`/read/${id}`}>
                  <Button 
                    size="sm" 
                    className="book-read-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Read Book
                  </Button>
                </Link>
              ) : (
                <Link href="/verification">
                  <Button 
                    size="sm" 
                    className="book-read-btn text-xs px-2 py-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <BookOpen className="w-3 h-3 mr-1" />
                    Verify to Read
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
        
        <div 
          className="book-action-icon" 
          onClick={handleDownloadReceipt}
        >
          <Image src="/icons/receipt.svg" alt="Receipt" width={16} height={16} />
        </div>
      </div>
    </div>
  </li>
  );
};

export default BorrowedBookCard;
