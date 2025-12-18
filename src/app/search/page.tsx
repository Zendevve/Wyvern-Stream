import { Suspense } from 'react';
import SearchContent from './SearchContent';

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchContent />
    </Suspense>
  );
}

function SearchSkeleton() {
  return (
    <div className="min-h-screen py-8 px-[4vw]">
      <div className="max-w-2xl mx-auto mb-12">
        <h1 className="text-[var(--text-3xl)] font-bold text-center mb-8">
          Search
        </h1>
        <div className="space-y-2">
          <div className="h-5 w-40 skeleton rounded" />
          <div className="h-14 w-full skeleton rounded-[var(--radius-md)]" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto text-center py-16">
        <p className="text-[var(--text-muted)] text-lg">
          Start typing to search for movies and TV shows
        </p>
      </div>
    </div>
  );
}
