"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Calendar, AlertCircle, CheckCircle, Download } from "lucide-react";
import BookCover from "@/components/BookCover";
import generateReceiptPDF from "@/lib/utils/pdfReceipt";
import { toast } from "@/hooks/use-toast";

interface BookDetailsModalProps {
  book: {
    id: string;
    title: string;
    author: string;
    genre: string;
    coverUrl: string;
    coverColor: string;
    description: string;
    borrowedDate: string;
    dueDate: string;
    status: 'borrowed' | 'overdue' | 'returned';
  };
  user?: {
    id: string;
    fullName: string;
    email: string;
    studentId?: string;
    department?: string;
  };
  borrowRecord?: {
    id: string;
    borrowDate: string;
    dueDate: string;
    returnDate?: string;
    status: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onReturnBook?: () => void;
}

const BookDetailsModal: React.FC<BookDetailsModalProps> = ({
  book,
  user,
  borrowRecord,
  isOpen,
  onClose,
  onReturnBook,
}) => {
  // Extract the path from the full ImageKit URL for BookCover component
  const coverImagePath = book.coverUrl?.startsWith('https://ik.imagekit.io/lclakhyajit') 
    ? book.coverUrl.replace('https://ik.imagekit.io/lclakhyajit', '')
    : book.coverUrl;

  const handleDownloadReceipt = async () => {
    if (!user || !borrowRecord) {
      toast({
        title: "Error",
        description: "User or borrow record information not available",
        variant: "destructive",
      });
      return;
    }

    try {
      await generateReceiptPDF({
        book: {
          ...book,
          borrowedDate: borrowRecord.borrowDate,
          dueDate: borrowRecord.dueDate,
          status: borrowRecord.status,
        },
        user,
        borrowRecord,
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

  const getStatusIcon = () => {
    switch (book.status) {
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'returned':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      default:
        return <Calendar className="w-5 h-5 text-blue-400" />;
    }
  };

  const getStatusColor = () => {
    switch (book.status) {
      case 'overdue':
        return 'text-red-400';
      case 'returned':
        return 'text-green-400';
      default:
        return 'text-blue-400';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-dark-300 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white">Book Details</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-black hover:text-black hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Book Cover */}
              <div className="flex justify-center">
                <BookCover
                  variant="wide"
                  className="book-3d-hero"
                  coverColor={book.coverColor}
                  coverImage={coverImagePath}
                />
              </div>

              {/* Book Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{book.title}</h3>
                  <p className="text-light-100 text-lg">By {book.author}</p>
                  <p className="text-light-100 italic">{book.genre}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon()}
                    <span className={`font-medium ${getStatusColor()}`}>
                      {book.status === 'overdue' ? 'Overdue' : 
                       book.status === 'returned' ? 'Returned' : 'Currently Borrowed'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-light-100">Borrowed Date:</span>
                      <span className="text-white font-medium">{book.borrowedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-light-100">Due Date:</span>
                      <span className="text-white font-medium">{book.dueDate}</span>
                    </div>
                  </div>

                  {book.description && (
                    <div>
                      <h4 className="text-white font-medium mb-2">Description</h4>
                      <p className="text-light-100 text-sm leading-relaxed">
                        {book.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {book.status === 'borrowed' && onReturnBook && (
                    <Button
                      onClick={onReturnBook}
                      className="bg-primary text-dark-100 hover:bg-primary/90 font-medium"
                    >
                      Return Book
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleDownloadReceipt}
                    className="border-primary text-primary hover:bg-primary hover:text-dark-100 font-medium"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Receipt
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookDetailsModal;
