"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Receipt } from "lucide-react";

interface ReceiptButtonProps {
  book: {
    id: string;
    title: string;
    author: string;
    borrowedDate: string;
    dueDate: string;
    status: string;
  };
  user: {
    fullName: string;
    universityId: number;
    email: string;
  };
}

const ReceiptButton: React.FC<ReceiptButtonProps> = ({ book, user }) => {
  const generateReceipt = async () => {
    try {
      const response = await fetch("/api/receipt/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          book,
          user,
          receiptId: `RCP-${Date.now()}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate receipt");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${book.title.replace(/\s+/g, '-')}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error generating receipt:", error);
    }
  };

  return (
    <Button
      onClick={generateReceipt}
      variant="ghost"
      size="sm"
      className="text-light-100 hover:text-white"
    >
      <Receipt className="w-4 h-4 mr-2" />
      Download Receipt
    </Button>
  );
};

export default ReceiptButton;
