'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardSkeleton } from '@/components/ui';
import type { MediaItem } from '@/types/tmdb';

export default function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  const [inputValue, setInputValue] = useState(query);
  const [results, setResults] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Search when query param changes
  useEffect(() => {
    if (query) {
      setInputValue(query);
      performSearch(query);
    }
  }, [query, performSearch]);

  // Debounced search on input change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (inputValue !== query) {
        const newUrl = inputValue ? `/search?q=${encodeURIComponent(inputValue)}` : '/search';
        router.push(newUrl, { scroll: false });
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [inputValue, query, router]);

  return (
    <div className="min-h-screen py-8 px-[4vw]">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto mb-12">
        <h1 className="text-[var(--text-3xl)] font-bold text-center mb-8">
          Search
        </h1>

        {/* Search Input - Top Aligned Label Pattern */}
        <div className="space-y-2">
          <label
            htmlFor="search-input"
            className="block text-[var(--text-secondary)] text-sm"
          >
            Find movies and TV shows
          </label>
          <div className="relative">
            {/* Search Icon on Left */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="search-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type to search..."
              className="w-full pl-12 pr-4 py-4 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
              autoComplete="off"
              autoFocus
            />
            {inputValue && (
              <button
                onClick={() => setInputValue('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1"
                aria-label="Clear search"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : results.length > 0 ? (
          <>
            <p className="text-[var(--text-secondary)] mb-6">
              Found {results.length} results for &quot;{query}&quot;
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {results.map((item) => (
                <Card
                  key={`${item.mediaType}-${item.id}`}
                  id={item.id}
                  title={item.title}
                  posterPath={item.posterPath}
                  mediaType={item.mediaType}
                  rating={item.voteAverage}
                />
              ))}
            </div>
          </>
        ) : hasSearched ? (
          <div className="text-center py-16">
            <p className="text-[var(--text-muted)] text-lg mb-2">
              No results found for &quot;{query}&quot;
            </p>
            <p className="text-[var(--text-muted)] text-sm">
              Try searching for something else
            </p>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-[var(--text-muted)] text-lg">
              Start typing to search for movies and TV shows
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
