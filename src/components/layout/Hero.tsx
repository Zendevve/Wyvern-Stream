import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui';

interface HeroProps {
  id: number;
  title: string;
  overview: string;
  backdropPath: string | null;
  mediaType: 'movie' | 'tv';
  releaseDate?: string;
  voteAverage?: number;
}

export function Hero({
  id,
  title,
  overview,
  backdropPath,
  mediaType,
  releaseDate,
  voteAverage,
}: HeroProps) {
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;
  const imageUrl = backdropPath
    ? `https://image.tmdb.org/t/p/original${backdropPath}`
    : null;

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] max-h-[800px]">
      {/* Background Image */}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={title}
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end pb-16 px-[4vw]">
        <div className="max-w-2xl">
          {/* Title */}
          <h1 className="text-[var(--text-hero)] font-extrabold leading-tight mb-4 text-balance">
            {title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 mb-4 text-[var(--text-sm)]">
            {year && (
              <span className="px-2 py-1 rounded-[var(--radius-sm)] bg-white/10">
                {year}
              </span>
            )}
            <span className="px-2 py-1 rounded-[var(--radius-sm)] bg-white/10 capitalize">
              {mediaType === 'tv' ? 'TV Series' : 'Movie'}
            </span>
            {voteAverage && voteAverage > 0 && (
              <span className="flex items-center gap-1 text-[var(--accent)]">
                <span>★</span>
                <span>{voteAverage.toFixed(1)}</span>
              </span>
            )}
          </div>

          {/* Overview */}
          <p className="text-[var(--text-secondary)] text-[var(--text-base)] line-clamp-3 mb-6 max-w-xl">
            {overview || 'No description available.'}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link href={`/${mediaType}/${id}`}>
              <Button variant="primary" size="lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Now
              </Button>
            </Link>
            <Link href={`/${mediaType}/${id}`}>
              <Button variant="secondary" size="lg">
                More Info
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HeroSkeleton() {
  return (
    <section className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] bg-[var(--bg-elevated)]">
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 flex flex-col justify-end pb-16 px-[4vw]">
        <div className="max-w-2xl space-y-4">
          <div className="h-16 w-96 max-w-full skeleton rounded-lg" />
          <div className="flex gap-3">
            <div className="h-8 w-16 skeleton rounded" />
            <div className="h-8 w-20 skeleton rounded" />
            <div className="h-8 w-14 skeleton rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full skeleton rounded" />
            <div className="h-4 w-4/5 skeleton rounded" />
            <div className="h-4 w-3/5 skeleton rounded" />
          </div>
          <div className="flex gap-4 pt-2">
            <div className="h-12 w-36 skeleton rounded-lg" />
            <div className="h-12 w-28 skeleton rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
