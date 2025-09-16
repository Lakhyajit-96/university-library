"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface FilterDropdownProps {
  currentGenre: string;
  currentQuery: string;
}

const FilterDropdown = ({ currentGenre, currentQuery }: FilterDropdownProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGenre = e.target.value;
    const params = new URLSearchParams(searchParams);
    
    if (selectedGenre) {
      params.set('genre', selectedGenre);
    } else {
      params.delete('genre');
    }
    
    // Reset to page 1 when filtering
    params.delete('page');
    
    router.push(`/search?${params.toString()}`);
  };

  const genres = [
    "Programming",
    "Web Development", 
    "Computer Science",
    "System Design",
    "Software",
    "Self Help",
    "Horror",
    "Psychological Thriller",
    "Mystery Thriller",
    "Psychological Mystery",
    "Suspense Thriller",
    "Gothic Horror"
  ];

  return (
    <select 
      className="filter-dropdown" 
      value={currentGenre}
      onChange={handleFilterChange}
    >
      <option value="">Filter by: Department</option>
      {genres.map((genre) => (
        <option key={genre} value={genre}>
          {genre}
        </option>
      ))}
    </select>
  );
};

export default FilterDropdown;
