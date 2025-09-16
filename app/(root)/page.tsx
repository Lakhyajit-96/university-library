import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import { db } from "@/database/drizzle";
import { books, users } from "@/database/schema";
import { auth } from "@/auth";
import { sql } from "drizzle-orm";

const Home = async () => {
  const session = await auth();

  // Get 15 random books for homepage
  const randomBooks = (await db
    .select()
    .from(books)
    .orderBy(sql`RANDOM()`)
    .limit(15)) as Book[];

  // Get a separate random book for the hero section
  const heroBook = (await db
    .select()
    .from(books)
    .orderBy(sql`RANDOM()`)
    .limit(1)) as Book[];

  return (
    <>
      <BookOverview {...heroBook[0]} userId={session?.user?.id as string} />

      <BookList
        title="Discover Books"
        books={randomBooks}
        containerClassName="mt-28"
      />
    </>
  );
};

export default Home;
