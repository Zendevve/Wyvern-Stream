'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';

// Confirmed working providers with ad blockers enabled (Dec 2024)
const VIDEO_PROVIDERS = [
  {
    id: 'superembed',
    name: 'SuperEmbed ⭐',
    getMovieUrl: (tmdbId: number) => `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`,
    getTvUrl: (tmdbId: number, season: number, episode: number) =>
      `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`,
  },
  {
    id: 'vidsrc-me',
    name: 'VidSrc.me',
    getMovieUrl: (tmdbId: number) => `https://vidsrc.net/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId: number, season: number, episode: number) =>
      `https://vidsrc.net/embed/tv/${tmdbId}/${season}/${episode}`,
  },
  {
    id: 'nontongo',
    name: 'Nontongo',
    getMovieUrl: (tmdbId: number) => `https://www.nontongo.win/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId: number, season: number, episode: number) =>
      `https://www.nontongo.win/embed/tv/${tmdbId}/${season}/${episode}`,
  },
] as const;

interface VideoPlayerProps {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  season?: number;
  episode?: number;
  posterPath?: string | null;
  title?: string;
}

export function VideoPlayer({
  tmdbId,
  mediaType,
  season,
  episode,
  posterPath,
  title,
}: VideoPlayerProps) {
  const [selectedProvider, setSelectedProvider] = useState<string>(VIDEO_PROVIDERS[0].id);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const embedUrl = useMemo(() => {
    const provider = VIDEO_PROVIDERS.find(p => p.id === selectedProvider);
    if (!provider) return null;

    if (mediaType === 'movie') {
      return provider.getMovieUrl(tmdbId);
    }

    if (mediaType === 'tv' && season && episode) {
      return provider.getTvUrl(tmdbId, season, episode);
    }

    return null;
  }, [selectedProvider, tmdbId, mediaType, season, episode]);

  const posterUrl = posterPath
    ? `https://image.tmdb.org/t/p/w780${posterPath}`
    : null;

  const handleProviderChange = (providerId: string) => {
    setSelectedProvider(providerId);
    setIsLoaded(false);
    setHasError(false);
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

  return (
    <div className="space-y-3">
      {/* Provider Selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[var(--text-secondary)] text-sm">Server:</span>
        {VIDEO_PROVIDERS.map((provider) => (
          <button
            key={provider.id}
            onClick={() => handleProviderChange(provider.id)}
            className={`px-3 py-1.5 text-sm rounded-[var(--radius-sm)] transition-all ${selectedProvider === provider.id
              ? 'bg-[var(--accent)] text-white'
              : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-white/10'
              }`}
          >
            {provider.name}
          </button>
        ))}
      </div>

      {/* Player Container */}
      <div className="relative aspect-video w-full bg-[var(--bg-base)] rounded-[var(--radius-md)] overflow-hidden">
        {/* Skeleton / Poster Placeholder */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 z-10">
            {posterUrl && (
              <Image
                src={posterUrl}
                alt={title || 'Loading...'}
                fill
                sizes="100vw"
                className="object-cover opacity-50"
                priority
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="flex flex-col items-center gap-4">
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
                  Try switching to a different server above.
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

        {/* Video iframe - No sandbox to allow third-party players to work */}
        {!hasError && embedUrl && (
          <iframe
            key={embedUrl} // Force remount on URL change
            src={embedUrl}
            className="absolute inset-0 w-full h-full border-none"
            loading="lazy"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            title={`Watch ${title || 'Video'}`}
          />
        )}
      </div>

      {/* Provider Info */}
      <p className="text-[var(--text-muted)] text-xs">
        If video doesn&apos;t play, try a different server. Some servers may have different content availability.
      </p>
    </div>
  );
}
