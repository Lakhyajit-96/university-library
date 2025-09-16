"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import BookDetailsModal from "@/components/BookDetailsModal";
import BorrowedBookCard from "@/components/BorrowedBookCard";
import UserQRCode from "@/components/UserQRCode";
import { returnBook } from "@/lib/actions/book";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, Shield } from "lucide-react";

interface BorrowedBook {
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
  verificationStatus?: 'VERIFIED' | 'UNVERIFIED' | 'PENDING_VERIFICATION' | 'REJECTED';
  isLoanedBook?: boolean;
  borrowRecordId?: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  universityId: number;
  profilePicture?: string | null;
  department?: string | null;
  dateOfBirth?: string | null;
  contactNumber?: string | null;
  verificationStatus?: 'UNVERIFIED' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED';
  verificationSteps?: string | null;
  verificationDocuments?: string | null;
  verificationDate?: string | null;
}

interface ProfilePageClientProps {
  user: User;
  borrowedBooks: BorrowedBook[];
}

const ProfilePageClient: React.FC<ProfilePageClientProps> = ({ user, borrowedBooks }) => {
  const [selectedBook, setSelectedBook] = useState<BorrowedBook | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(user.profilePicture);

  const handleBookClick = (book: BorrowedBook) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const handleReturnBook = async () => {
    if (!selectedBook) return;

    try {
      const result = await returnBook(selectedBook.borrowRecordId || selectedBook.id);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Book returned successfully!",
        });
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error in handleReturnBook:", error);
      toast({
        title: "Error",
        description: "Failed to return book. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpdate = (imageUrl: string) => {
    setProfileImage(imageUrl);
  };

  return (
    <>
      <div className="profile-page">
        <div className="profile-container">
          {/* Left Section - User Profile with ID Card Design */}
          <div className="profile-section">
            <div className="id-card-container">
              {/* Dark Bar Design Element */}
              <div className="id-card-top-bar"></div>
              {/* Profile Header - Horizontal Layout */}
              <div className="profile-header-horizontal">
                <div className="profile-photo">
                  <ProfilePictureUpload
                    currentImage={profileImage}
                    userId={user.id}
                    onImageUpdate={handleImageUpdate}
                  />
                  <div className="profile-details-below-photo">
                    <div className="detail-item">
                      <span className="detail-label">University</span>
                      <span className="detail-value">JS Mastery Pro</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Student ID</span>
                      <span className="detail-value">{user.universityId}</span>
                    </div>
                  </div>
                </div>
                <div className="profile-info-horizontal">
                  <h2 className="profile-name">{user.fullName}</h2>
                  <p className="profile-email">{user.email}</p>
                </div>
              </div>

              {/* Verification Status Section */}
              <div className="verification-status-section">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-primary" />
                    <div>
                      <h3 className="text-white font-semibold">Student Verification</h3>
                      <p className="text-light-100 text-sm">
                        {user.verificationStatus === 'VERIFIED' 
                          ? 'You are a verified student with premium benefits'
                          : user.verificationStatus === 'PENDING_VERIFICATION'
                          ? 'Your verification is under review'
                          : user.verificationStatus === 'REJECTED'
                          ? 'Verification was rejected. Please try again.'
                          : 'Complete verification to unlock premium features'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {user.verificationStatus === 'PENDING_VERIFICATION' ? (
                      <Badge className="bg-yellow-500 text-white">
                        <Clock className="w-4 h-4 mr-1" />
                        Pending Review
                      </Badge>
                    ) : user.verificationStatus === 'REJECTED' ? (
                      <Badge className="bg-red-500 text-white">
                        <XCircle className="w-4 h-4 mr-1" />
                        Rejected
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-500 text-white">
                        <Shield className="w-4 h-4 mr-1" />
                        Unverified
                      </Badge>
                    )}
                    
                    {user.verificationStatus !== 'VERIFIED' && (
                      <Link href="/verification">
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          {user.verificationStatus === 'PENDING_VERIFICATION' ? 'Check Status' : 'Get Verified'}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
                
                {user.verificationStatus === 'VERIFIED' && (
                  <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <h4 className="text-green-400 font-semibold mb-2">Verified Student Benefits</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-light-100">
                      <div>• Extended borrowing period (14 days)</div>
                      <div>• Priority access to new books</div>
                      <div>• Reduced late fees (50% off)</div>
                      <div>• Exclusive study materials</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Realistic University ID Card */}
              <div className="realistic-id-card">
                {/* Floating Particles */}
                <div className="particles-container">
                  <div className="particle"></div>
                  <div className="particle"></div>
                  <div className="particle"></div>
                  <div className="particle"></div>
                  <div className="particle"></div>
                  <div className="particle"></div>
                  <div className="particle"></div>
                  <div className="particle"></div>
                  <div className="particle"></div>
                  <div className="particle"></div>
                  <div className="particle"></div>
                  <div className="particle"></div>
                </div>
                
                {/* Holographic Security Strip */}
                <div className="security-strip"></div>
                
                {/* Card Header */}
                <div className="id-card-header">
                  <div className="university-logo">
                    <div className="logo-shield">
                      <div className="shield-icon">🎓</div>
                    </div>
                  </div>
                  <div className="university-info">
                    <h3>JS MASTERY UNIVERSITY</h3>
                    <p>Empowering Dreams, Inspiring Futures</p>
                    <div className="card-type">STUDENT ID CARD</div>
                  </div>
                  <div className="security-features">
                    <div className="microchip"></div>
                    <div className="hologram"></div>
                  </div>
                </div>
                
                {/* Card Content */}
                <div className="id-card-content">
                  <div className="student-photo-section">
                    <div className="student-photo">
                      <ProfilePictureUpload
                        currentImage={profileImage}
                        userId={user.id}
                        onImageUpdate={handleImageUpdate}
                      />
                    </div>
                    <div className="photo-border"></div>
                    <div className="signature-line"></div>
                  </div>
                  
                  <div className="student-details">
                    <div className="detail-row">
                      <span className="label">STUDENT ID</span>
                      <span className="value">{user.universityId}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">FULL NAME</span>
                      <span className="value">{user.fullName}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">DEPARTMENT</span>
                      <span className="value">{user.department || "Not Specified"}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">DATE OF BIRTH</span>
                      <span className="value">{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "Not Specified"}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">CONTACT</span>
                      <span className="value">{user.contactNumber || "Not Specified"}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">STATUS</span>
                      <span className={`value ${user.verificationStatus === 'VERIFIED' ? 'text-green-400' : user.verificationStatus === 'PENDING_VERIFICATION' ? 'text-yellow-400' : 'text-red-400'}`}>
                        {user.verificationStatus === 'VERIFIED' ? 'VERIFIED STUDENT' : 
                         user.verificationStatus === 'PENDING_VERIFICATION' ? 'PENDING VERIFICATION' :
                         user.verificationStatus === 'REJECTED' ? 'VERIFICATION REJECTED' : 'UNVERIFIED'}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">VALID UNTIL</span>
                      <span className="value">12/31/2025</span>
                    </div>
                  </div>
                </div>
                
                {/* Card Footer */}
                <div className="id-card-footer">
                  <div className="barcode-section">
                    <div className="barcode">
                      <div className="barcode-line"></div>
                      <div className="barcode-line"></div>
                      <div className="barcode-line"></div>
                      <div className="barcode-line"></div>
                      <div className="barcode-line"></div>
                      <div className="barcode-line"></div>
                      <div className="barcode-line"></div>
                      <div className="barcode-line"></div>
                      <div className="barcode-line"></div>
                      <div className="barcode-line"></div>
                      <div className="barcode-line"></div>
                      <div className="barcode-line"></div>
                    </div>
                    <div className="barcode-number">{user.universityId}</div>
                  </div>
                  
                  <div className="qr-code-section">
                    <UserQRCode 
                      userId={user.id} 
                      userName={user.fullName}
                      className="qr-code"
                    />
                    <div className="qr-label">SCAN FOR VERIFICATION</div>
                  </div>
                </div>
                
                {/* Security Watermark */}
                <div className="security-watermark">JS UNIVERSITY</div>
              </div>
            </div>
          </div>

          {/* Right Section - Borrowed Books */}
          <div className="borrowed-books-section">
            <div className="section-header">
              <h2>Borrowed books</h2>
              <Image src="/icons/info.svg" alt="Info" width={20} height={20} />
            </div>
            
            {borrowedBooks.length > 0 ? (
              <ul className="books-grid">
                {borrowedBooks.map((book) => (
                  <BorrowedBookCard
                    key={book.id}
                    id={book.id}
                    title={book.title}
                    author={book.author}
                    genre={book.genre}
                    coverColor={book.coverColor}
                    coverUrl={book.coverUrl}
                    borrowedDate={book.borrowedDate}
                    dueDate={book.dueDate}
                    status={book.status}
                    verificationStatus={book.verificationStatus}
                    borrowRecordId={book.borrowRecordId}
                    user={user}
                    onBookClick={() => handleBookClick(book)}
                    onReturnBook={() => {
                      setSelectedBook(book);
                      handleReturnBook();
                    }}
                  />
                ))}
              </ul>
            ) : (
              <div className="no-books-message">
                <p>No borrowed books found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Book Details Modal */}
      {selectedBook && (
        <BookDetailsModal
          book={selectedBook}
          user={user}
          borrowRecord={{
            id: selectedBook.borrowRecordId || selectedBook.id,
            borrowDate: selectedBook.borrowedDate,
            dueDate: selectedBook.dueDate,
            status: selectedBook.status.toUpperCase(),
          }}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onReturnBook={selectedBook.status === 'borrowed' ? handleReturnBook : undefined}
        />
      )}
    </>
  );
};

export default ProfilePageClient;
