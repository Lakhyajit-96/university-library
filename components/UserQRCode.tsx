"use client";

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface UserQRCodeProps {
  userId: string;
  userName: string;
  className?: string;
}

const UserQRCode: React.FC<UserQRCodeProps> = ({ userId, userName, className = "" }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        // Create unique URL for each user that redirects to your app
        const userProfileUrl = `https://university-library-seven-roan.vercel.app/profile/${userId}`;
        
        console.log('Generating QR code for URL:', userProfileUrl);
        
        // Generate QR code with user-specific data
        const qrCodeOptions = {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M' as const
        };

        const qrCodeData = await QRCode.toDataURL(userProfileUrl, qrCodeOptions);
        console.log('QR code generated successfully');
        setQrCodeDataUrl(qrCodeData);
      } catch (error) {
        console.error('Error generating QR code:', error);
        // Fallback to a simple pattern if QR generation fails
        setQrCodeDataUrl('');
      }
    };

    generateQRCode();
  }, [userId]);

  // Always show fallback QR code pattern for now
  return (
    <div className={`qr-code ${className}`}>
      <div className="qr-grid">
        <div className="qr-square"></div>
        <div className="qr-square"></div>
        <div className="qr-square"></div>
        <div className="qr-square"></div>
        <div className="qr-square"></div>
        <div className="qr-square"></div>
        <div className="qr-square"></div>
        <div className="qr-square"></div>
        <div className="qr-square"></div>
        <div className="qr-square"></div>
        <div className="qr-square"></div>
        <div className="qr-square"></div>
        <div className="qr-square"></div>
        <div className="qr-square"></div>
        <div className="qr-square"></div>
        <div className="qr-square"></div>
      </div>
    </div>
  );
};

export default UserQRCode;
