"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Session } from "next-auth";
import { getUserProfile } from "@/lib/actions/user";
import { usePathname } from "next/navigation";

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  profilePicture?: string | null;
  verificationStatus?: string | null;
}

const UserProfileSection = ({ session }: { session: Session }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-gray-600 text-white text-sm">
            ...
          </AvatarFallback>
        </Avatar>
        <span className="text-white text-sm">Loading...</span>
      </div>
    );
  }

  const isProfileActive = pathname === "/my-profile";

  return (
    <Link 
      href="/my-profile" 
      className={`flex items-center gap-3 hover:opacity-80 transition-all duration-200 ${
        isProfileActive ? "hover:opacity-100" : ""
      }`}
    >
      <Avatar className="w-8 h-8">
        {userProfile?.profilePicture ? (
          <AvatarImage 
            src={userProfile.profilePicture} 
            alt={userProfile.fullName}
            className="object-cover"
          />
        ) : null}
        <AvatarFallback className="bg-primary text-white text-sm">
          {userProfile?.fullName?.charAt(0) || session?.user?.name?.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className={`text-sm transition-colors ${
          isProfileActive 
            ? "text-primary font-semibold" 
            : "text-white hover:text-gray-300"
        }`}>
          {userProfile?.fullName || session?.user?.name || "User"}
        </span>
        {userProfile?.verificationStatus === 'VERIFIED' && (
          <span className="text-green-400 text-xs">✓ Verified</span>
        )}
      </div>
    </Link>
  );
};

export default UserProfileSection;
