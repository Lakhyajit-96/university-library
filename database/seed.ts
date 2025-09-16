import dummyBooks from "../dummybooks.json";
import ImageKit from "imagekit";
import { books, borrowRecords } from "@/database/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});

const uploadToImageKit = async (
  url: string,
  fileName: string,
  folder: string,
) => {
  try {
    const response = await imagekit.upload({
      file: url,
      fileName,
      folder,
    });

    return response.filePath;
  } catch (error) {
    console.error("Error uploading image to ImageKit:", error);
  }
};

const seed = async () => {
  console.log("Seeding data...");

  try {
    // Clear existing borrow records first (due to foreign key constraints)
    console.log("Clearing existing borrow records...");
    await db.delete(borrowRecords);
    
    // Clear existing books
    console.log("Clearing existing books...");
    await db.delete(books);
    
    for (const book of dummyBooks) {
      let coverUrl = book.coverUrl;
      let videoUrl = book.videoUrl;

      // Try to upload to ImageKit, but use original URL if it fails
      try {
        const uploadedCoverUrl = await uploadToImageKit(
          book.coverUrl,
          `${book.title}.jpg`,
          "/books/covers",
        );
        if (uploadedCoverUrl) {
          coverUrl = uploadedCoverUrl;
        }
      } catch (error) {
        console.log(`Using original cover URL for ${book.title}`);
      }

      try {
        const uploadedVideoUrl = await uploadToImageKit(
          book.videoUrl,
          `${book.title}.mp4`,
          "/books/videos",
        );
        if (uploadedVideoUrl) {
          videoUrl = uploadedVideoUrl;
        }
      } catch (error) {
        console.log(`Using original video URL for ${book.title}`);
      }

      await db.insert(books).values({
        ...book,
        coverUrl,
        videoUrl,
      });
    }

    console.log("Data seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};

seed();
