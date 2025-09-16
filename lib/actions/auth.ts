"use server";

import { signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";

export async function signOutAction() {
  await signOut();
}

export async function signInWithCredentials(data: { email: string; password: string }) {
  try {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: "Invalid email or password" };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: "An error occurred during sign in" };
  }
}

export async function signUp(data: {
  fullName: string;
  email: string;
  universityId: number;
  universityCard: string;
  password: string;
}) {
  try {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (existingUser.length > 0) {
      return { success: false, error: "User with this email already exists" };
    }

    // Check if university ID already exists
    const existingUniversityId = await db
      .select()
      .from(users)
      .where(eq(users.universityId, data.universityId))
      .limit(1);

    if (existingUniversityId.length > 0) {
      return { success: false, error: "University ID already exists" };
    }

    // Hash password
    const hashedPassword = await hash(data.password, 12);

    // Create user
    await db.insert(users).values({
      fullName: data.fullName,
      email: data.email,
      universityId: data.universityId,
      password: hashedPassword,
      universityCard: data.universityCard,
      status: "PENDING",
      role: "USER",
    });

    return { success: true };
  } catch (error) {
    console.error("Sign up error:", error);
    return { success: false, error: "An error occurred during sign up" };
  }
}