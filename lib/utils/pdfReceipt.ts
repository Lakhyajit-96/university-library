import jsPDF from 'jspdf';

interface ReceiptData {
  book: {
    id: string;
    title: string;
    author: string;
    genre: string;
    coverUrl: string;
    borrowedDate: string;
    dueDate: string;
    status: string;
  };
  user: {
    id: string;
    fullName: string;
    email: string;
    studentId?: string;
    department?: string;
  };
  borrowRecord: {
    id: string;
    borrowDate: string;
    dueDate: string;
    returnDate?: string;
    status: string;
  };
}

export const generateReceiptPDF = async (data: ReceiptData): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Set font
  doc.setFont('helvetica');
  
  // Premium Colors
  const primaryColor = [30, 58, 138]; // Deep blue
  const secondaryColor = [59, 130, 246]; // Bright blue
  const accentColor = [16, 185, 129]; // Emerald green
  const darkColor = [17, 24, 39]; // Dark slate
  const lightGray = [243, 244, 246]; // Light gray
  const textGray = [107, 114, 128]; // Text gray
  
  // Premium Header with Gradient Effect
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  
  // LearnWise Branding
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('LearnWise', 20, 20);
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Digital Learning Platform', 20, 28);
  
  doc.setFontSize(12);
  doc.text('Book Borrowing Receipt', 20, 35);
  
  // Receipt Details (Right side)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Receipt #: LW-${data.borrowRecord.id}`, pageWidth - 70, 15);
  doc.text(`Transaction ID: TXN-${Date.now()}`, pageWidth - 70, 22);
  doc.text(`Date: ${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`, pageWidth - 70, 29);
  doc.text(`Time: ${new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })}`, pageWidth - 70, 36);
  doc.text(`Location: Digital Library`, pageWidth - 70, 43);
  
  // Premium Student Information Section
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(15, 60, pageWidth - 30, 35, 'F');
  
  // Section Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(15, 60, pageWidth - 30, 8, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('STUDENT INFORMATION', 20, 66);
  
  // Student Details
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Full Name:', 20, 78);
  doc.setFont('helvetica', 'normal');
  doc.text(data.user.fullName, 50, 78);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Email Address:', 20, 84);
  doc.setFont('helvetica', 'normal');
  doc.text(data.user.email, 70, 84);
  
  if (data.user.studentId) {
    doc.setFont('helvetica', 'bold');
    doc.text('Student ID:', pageWidth - 100, 78);
    doc.setFont('helvetica', 'normal');
    doc.text(data.user.studentId, pageWidth - 60, 78);
  }
  
  if (data.user.department) {
    doc.setFont('helvetica', 'bold');
    doc.text('Department:', pageWidth - 100, 84);
    doc.setFont('helvetica', 'normal');
    doc.text(data.user.department, pageWidth - 60, 84);
  }
  
  // Account Status
  doc.setFont('helvetica', 'bold');
  doc.text('Account Status:', 20, 90);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text('ACTIVE', 70, 90);
  
  // Premium Book Information Section
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(15, 105, pageWidth - 30, 40, 'F');
  
  // Section Header
  doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.rect(15, 105, pageWidth - 30, 8, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('BOOK INFORMATION', 20, 111);
  
  // Book Details
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Book Title:', 20, 123);
  doc.setFont('helvetica', 'normal');
  doc.text(data.book.title, 50, 123);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Author:', 20, 129);
  doc.setFont('helvetica', 'normal');
  doc.text(data.book.author, 50, 129);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Genre:', 20, 135);
  doc.setFont('helvetica', 'normal');
  doc.text(data.book.genre, 50, 135);
  
  // Book ID and ISBN (simulated)
  doc.setFont('helvetica', 'bold');
  doc.text('Book ID:', pageWidth - 100, 123);
  doc.setFont('helvetica', 'normal');
  doc.text(`LW-BK-${data.book.id}`, pageWidth - 60, 123);
  
  doc.setFont('helvetica', 'bold');
  doc.text('ISBN:', pageWidth - 100, 129);
  doc.setFont('helvetica', 'normal');
  doc.text(`978-${Math.floor(Math.random() * 900000000) + 100000000}`, pageWidth - 60, 129);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Condition:', pageWidth - 100, 135);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text('EXCELLENT', pageWidth - 60, 135);
  
  // Premium Borrowing Details Section
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(15, 155, pageWidth - 30, 45, 'F');
  
  // Section Header
  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.rect(15, 155, pageWidth - 30, 8, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('BORROWING DETAILS', 20, 161);
  
  // Borrowing Information
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Borrow Date:', 20, 173);
  doc.setFont('helvetica', 'normal');
  doc.text(data.borrowRecord.borrowDate, 60, 173);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Due Date:', 20, 179);
  doc.setFont('helvetica', 'normal');
  doc.text(data.borrowRecord.dueDate, 60, 179);
  
  if (data.borrowRecord.returnDate) {
    doc.setFont('helvetica', 'bold');
    doc.text('Return Date:', 20, 185);
    doc.setFont('helvetica', 'normal');
    doc.text(data.borrowRecord.returnDate, 60, 185);
  }
  
  // Borrowing Period and Fees
  doc.setFont('helvetica', 'bold');
  doc.text('Borrowing Period:', pageWidth - 100, 173);
  doc.setFont('helvetica', 'normal');
  try {
    const borrowDate = new Date(data.borrowRecord.borrowDate);
    const dueDate = new Date(data.borrowRecord.dueDate);
    const daysDiff = Math.ceil((dueDate.getTime() - borrowDate.getTime()) / (1000 * 60 * 60 * 24));
    doc.text(`${daysDiff} days`, pageWidth - 60, 173);
  } catch (error) {
    doc.text('7 days', pageWidth - 60, 173);
  }
  
  doc.setFont('helvetica', 'bold');
  doc.text('Late Fee Rate:', pageWidth - 100, 179);
  doc.setFont('helvetica', 'normal');
  doc.text('$0.50/day', pageWidth - 60, 179);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Max Renewals:', pageWidth - 100, 185);
  doc.setFont('helvetica', 'normal');
  doc.text('2 times', pageWidth - 60, 185);
  
  // Status Badge
  const statusColor = data.borrowRecord.status === 'RETURNED' ? [46, 204, 113] : 
                     data.borrowRecord.status === 'OVERDUE' ? [231, 76, 60] : 
                     [52, 152, 219];
  
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.rect(pageWidth - 80, 190, 60, 8, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(data.borrowRecord.status, pageWidth - 50, 195, { align: 'center' });
  
  // Premium Terms and Conditions Section
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(15, 210, pageWidth - 30, 35, 'F');
  
  // Section Header
  doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.rect(15, 210, pageWidth - 30, 8, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TERMS & CONDITIONS', 20, 216);
  
  // Terms Content
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('• Books must be returned by the due date to avoid late fees', 20, 225);
  doc.text('• Late fees are charged at $0.50 per day after the due date', 20, 230);
  doc.text('• Damaged or lost books will incur replacement charges', 20, 235);
  doc.text('• This receipt serves as proof of borrowing transaction', 20, 240);
  
  // Digital Signature Section
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(15, 255, pageWidth - 30, 25, 'F');
  
  // Signature Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(15, 255, pageWidth - 30, 8, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DIGITAL SIGNATURE', 20, 261);
  
  // Signature Line
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Authorized by:', 20, 270);
  
  // Signature line
  doc.setDrawColor(textGray[0], textGray[1], textGray[2]);
  doc.setLineWidth(0.5);
  doc.line(60, 270, pageWidth - 60, 270);
  
  doc.setFont('helvetica', 'bold');
  doc.text('LearnWise Digital Library System', 60, 275);
  
  // System Information
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(textGray[0], textGray[1], textGray[2]);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth - 100, 270);
  doc.text(`System Version: v2.1.0`, pageWidth - 100, 275);
  
  // Premium Footer
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('LearnWise Digital Learning Platform', pageWidth / 2, pageHeight - 12, { align: 'center' });
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Empowering Education Through Technology', pageWidth / 2, pageHeight - 6, { align: 'center' });
  
  // Security Watermark
  doc.setTextColor(textGray[0], textGray[1], textGray[2]);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text('This is a digitally generated receipt. No physical copy required.', pageWidth / 2, pageHeight - 2, { align: 'center' });
  
  // Download the PDF
  const fileName = `LearnWise_Receipt_${data.book.title.replace(/[^a-zA-Z0-9]/g, '_')}_LW-${data.borrowRecord.id}.pdf`;
  doc.save(fileName);
};

export default generateReceiptPDF;
