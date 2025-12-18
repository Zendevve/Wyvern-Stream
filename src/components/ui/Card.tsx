import Image from 'next/image';
import Link from 'next/link';

export interface CardProps {
  id: number;
  title: string;
  posterPath: string | null;
  mediaType: 'movie' | 'tv';
  rating?: number;
}

export function Card({ id, title, posterPath, mediaType, rating }: CardProps) {
  const imageUrl = posterPath
    ? `https://image.tmdb.org/t/p/w342${posterPath}`
    : '/placeholder-poster.svg';

  return (
    <Link
      href={`/${mediaType}/${id}`}
      className="group relative flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px]"
    >
      <article className="relative overflow-hidden rounded-[var(--radius-md)] card-hover">
        {/* Poster Image */}
        <div className="relative aspect-[2/3] bg-[var(--bg-elevated)]">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 140px, (max-width: 768px) 160px, 180px"
            className="object-cover"
            loading="lazy"
          />

          {/* Skeleton loader shown while image loads */}
          <div className="absolute inset-0 skeleton opacity-0 group-hover:opacity-0" />
        </div>

        {/* Hover Overlay with Title */}
        <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          <h3 className="text-sm font-semibold text-white line-clamp-2">
            {title}
          </h3>
          {rating && rating > 0 && (
            <div className="flex items-center gap-1 mt-1 text-xs text-[var(--accent)]">
              <span>★</span>
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Orange border glow on hover */}
        <div className="absolute inset-0 rounded-[var(--radius-md)] border-2 border-transparent group-hover:border-[var(--accent)] transition-colors duration-300 pointer-events-none" />
      </article>
    </Link>
  );
}

export function CardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px]">
      <div className="relative aspect-[2/3] rounded-[var(--radius-md)] skeleton" />
    </div>
  );
}
