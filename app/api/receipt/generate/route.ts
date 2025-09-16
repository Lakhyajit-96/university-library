import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { book, user, receiptId } = await request.json();

    // For now, we'll return a simple HTML receipt that can be printed
    // In production, you'd use a library like jsPDF or Puppeteer to generate actual PDFs
    const receiptHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Book Borrowing Receipt</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #1a1a1a;
              color: white;
              padding: 20px;
              max-width: 600px;
              margin: 0 auto;
            }
            .receipt-header {
              text-align: center;
              border-bottom: 2px solid #4A4A5C;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .receipt-body {
              margin-bottom: 30px;
            }
            .receipt-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              padding: 8px 0;
              border-bottom: 1px solid #333;
            }
            .receipt-footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 2px solid #4A4A5C;
            }
            .status-overdue { color: #ef4444; }
            .status-returned { color: #10b981; }
            .status-borrowed { color: #3b82f6; }
          </style>
        </head>
        <body>
          <div class="receipt-header">
            <h1>JS Mastery University Library</h1>
            <h2>Book Borrowing Receipt</h2>
            <p>Receipt ID: ${receiptId}</p>
          </div>
          
          <div class="receipt-body">
            <div class="receipt-row">
              <span><strong>Student Name:</strong></span>
              <span>${user.fullName}</span>
            </div>
            <div class="receipt-row">
              <span><strong>Student ID:</strong></span>
              <span>${user.universityId}</span>
            </div>
            <div class="receipt-row">
              <span><strong>Email:</strong></span>
              <span>${user.email}</span>
            </div>
            <div class="receipt-row">
              <span><strong>Book Title:</strong></span>
              <span>${book.title}</span>
            </div>
            <div class="receipt-row">
              <span><strong>Author:</strong></span>
              <span>${book.author}</span>
            </div>
            <div class="receipt-row">
              <span><strong>Borrowed Date:</strong></span>
              <span>${book.borrowedDate}</span>
            </div>
            <div class="receipt-row">
              <span><strong>Due Date:</strong></span>
              <span>${book.dueDate}</span>
            </div>
            <div class="receipt-row">
              <span><strong>Status:</strong></span>
              <span class="status-${book.status}">${book.status.toUpperCase()}</span>
            </div>
          </div>
          
          <div class="receipt-footer">
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            <p>JS Mastery University Library System</p>
            <p>www.jsmastery.pro</p>
          </div>
        </body>
      </html>
    `;

    return new NextResponse(receiptHtml, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="receipt-${book.title.replace(/\s+/g, '-')}.html"`,
      },
    });
  } catch (error) {
    console.error("Receipt generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
