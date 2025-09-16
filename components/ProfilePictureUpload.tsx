"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { updateProfilePicture } from "@/lib/actions/profile";
import { toast } from "@/hooks/use-toast";

interface ProfilePictureUploadProps {
  currentImage?: string | null;
  userId: string;
  onImageUpdate: (imageUrl: string) => void;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentImage,
  userId,
  onImageUpdate,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Process the image client-side to create a data URL
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        
        // Update the image immediately
        onImageUpdate(dataUrl);
        
        // Update database
        const result = await updateProfilePicture(dataUrl);

        if (result.success) {
          toast({
            title: "Success",
            description: "Profile picture updated successfully!",
          });
        } else {
          throw new Error(result.error);
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <div
        className="profile-image-container cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleImageClick}
      >
        <Image
          src={currentImage || "/images/profile-placeholder.svg"}
          alt="Profile"
          width={120}
          height={120}
          className="profile-image"
        />
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ProfilePictureUpload;
