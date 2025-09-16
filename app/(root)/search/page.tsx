import React from "react";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { ilike, or, and, eq, sql } from "drizzle-orm";
import BookCard from "@/components/BookCard";
import FilterDropdown from "@/components/FilterDropdown";
import Pagination from "@/components/Pagination";
import Image from "next/image";
import Link from "next/link";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string; genre?: string }>;
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const params = await searchParams;
  const query = params.q || "";
  const page = parseInt(params.page || "1");
  const genre = params.genre || "";
  const itemsPerPage = 15;

  // Build search conditions
  const searchConditions = query
    ? or(
        ilike(books.title, `%${query}%`),
        ilike(books.author, `%${query}%`),
        ilike(books.genre, `%${query}%`)
      )
    : undefined;

  // Build genre filter conditions
  const genreConditions = genre ? eq(books.genre, genre) : undefined;

  // Combine all conditions
  const allConditions = [searchConditions, genreConditions].filter(Boolean);
  const finalCondition = allConditions.length > 1 
    ? and(...allConditions) 
    : allConditions[0];

  // Get total count for pagination
  const totalBooks = await db
    .select({ count: books.id })
    .from(books)
    .where(finalCondition);

  // Get books for current page
  let searchResults;
  if (query || genre) {
    // If there's a search query or genre filter, show filtered results
    searchResults = await db
      .select()
      .from(books)
      .where(finalCondition)
      .limit(itemsPerPage)
      .offset((page - 1) * itemsPerPage);
  } else {
    // If no search query, show random books
    searchResults = await db
      .select()
      .from(books)
      .orderBy(sql`RANDOM()`)
      .limit(itemsPerPage)
      .offset((page - 1) * itemsPerPage);
  }

  const totalPages = Math.ceil(totalBooks.length / itemsPerPage);

  return (
    <div className="search-page">
      {/* Hero Section */}
      <section className="search-hero">
        <h1 className="search-hero-title">
          <div className="first-line">DISCOVER YOUR NEXT GREAT READ:</div>
          <div className="second-line">Explore and Search for Any Book In Our Library</div>
        </h1>
        <div className="mt-8">
          <form className="search" action="/search" method="GET">
            <Image
              src="/icons/search-fill.svg"
              alt="search"
              width={20}
              height={20}
              className="search-icon"
            />
            <input
              type="text"
              placeholder="Search for books..."
              className="search-input"
              defaultValue={query}
              name="q"
              autoComplete="off"
            />
            {genre && <input type="hidden" name="genre" value={genre} />}
          </form>
        </div>
      </section>

      {/* Search Results */}
      <section className="search-results">
        <div className="search-results-header">
          <h2 className="search-results-title">
            {query ? (
              <>
                Search Result for <span className="query-text">{query}</span>
              </>
            ) : genre ? (
              <>
                Books in <span className="query-text">{genre}</span> genre
              </>
            ) : (
              "Discover Books"
            )}
          </h2>
          {searchResults.length > 0 && (
            <div className="search-filters">
              <FilterDropdown currentGenre={genre} currentQuery={query} />
            </div>
          )}
        </div>

        {/* Show empty state if no results */}
        {searchResults.length === 0 ? (
          <div className="search-empty-state">
            <div className="search-empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="8" y="8" width="8" height="8" stroke="white" strokeWidth="2" fill="none"/>
                <path d="M8 12H16M8 16H12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="search-empty-title">No Results Found</h3>
            <p className="search-empty-description">
              We couldn't find any books matching your search. Try using different keywords or check for typos.
            </p>
            <Link href="/search" className="search-clear-btn">
              CLEAR SEARCH
            </Link>
          </div>
        ) : (
          <>
            {/* Books Grid */}
            <ul className="book-list">
              {searchResults.map((book) => (
                <BookCard key={book.id} {...book} />
              ))}
            </ul>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination currentPage={page} totalPages={totalPages} />
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default SearchPage;
