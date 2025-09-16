"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export const updateProfilePicture = async (imageUrl: string) => {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    await db
      .update(users)
      .set({ profilePicture: imageUrl })
      .where(eq(users.id, session.user.id));

    return {
      success: true,
      data: { profilePicture: imageUrl },
    };
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return {
      success: false,
      error: "Failed to update profile picture",
    };
  }
};

export const updateUserProfile = async (profileData: {
  department?: string;
  dateOfBirth?: string;
  contactNumber?: string;
}) => {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    await db
      .update(users)
      .set({
        department: profileData.department,
        dateOfBirth: profileData.dateOfBirth,
        contactNumber: profileData.contactNumber,
      })
      .where(eq(users.id, session.user.id));

    return {
      success: true,
      data: profileData,
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return {
      success: false,
      error: "Failed to update profile",
    };
  }
};
