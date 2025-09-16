"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export const getUserProfile = async () => {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return null;
    }

    const [user] = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        profilePicture: users.profilePicture,
        verificationStatus: users.verificationStatus,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};
