'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';

interface VidkingPlayerProps {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  season?: number;
  episode?: number;
  posterPath?: string | null;
  title?: string;
}

export function VidkingPlayer({
  tmdbId,
  mediaType,
  season,
  episode,
  posterPath,
  title,
}: VidkingPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Construct the embed URL
  const getEmbedUrl = useCallback(() => {
    const baseUrl = 'https://vidking.net/embed';

    if (mediaType === 'movie') {
      return `${baseUrl}/movie/${tmdbId}`;
    }

    if (mediaType === 'tv' && season && episode) {
      return `${baseUrl}/tv/${tmdbId}/${season}/${episode}`;
    }

    return null;
  }, [tmdbId, mediaType, season, episode]);

  const embedUrl = getEmbedUrl();
  const posterUrl = posterPath
    ? `https://image.tmdb.org/t/p/w780${posterPath}`
    : null;

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  // For TV shows without season/episode selected
  if (mediaType === 'tv' && (!season || !episode)) {
    return (
      <div className="relative aspect-video w-full bg-[var(--bg-elevated)] rounded-[var(--radius-md)] flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">
          Select a season and episode to start watching
        </p>
      </div>
    );
  }

  if (!embedUrl) {
    return (
      <div className="relative aspect-video w-full bg-[var(--bg-elevated)] rounded-[var(--radius-md)] flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">
          Unable to load player
        </p>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full bg-[var(--bg-base)] rounded-[var(--radius-md)] overflow-hidden">
      {/* Skeleton / Poster Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={title || 'Loading...'}
              fill
              sizes="100vw"
              className="object-cover opacity-50"
              priority
            />
          ) : null}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="flex flex-col items-center gap-4">
              {/* Loading Spinner */}
              <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
              <p className="text-[var(--text-secondary)]">Loading player...</p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--bg-elevated)]">
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <svg className="w-16 h-16 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-[var(--text-primary)] font-semibold mb-2">
                Video unavailable
              </p>
              <p className="text-[var(--text-secondary)] text-sm max-w-sm">
                This content may not be available at the moment. Please try again later.
              </p>
            </div>
            <button
              onClick={() => {
                setHasError(false);
                setIsLoaded(false);
              }}
              className="btn btn-secondary mt-2"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Vidking iframe */}
      {!hasError && (
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin allow-forms"
          loading="lazy"
          allowFullScreen
          referrerPolicy="origin"
          onLoad={handleLoad}
          onError={handleError}
          title={`Watch ${title || 'Video'}`}
        />
      )}
    </div>
  );
}
