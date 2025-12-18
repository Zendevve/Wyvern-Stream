import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import { VideoPlayer } from '@/components/player';
import { Card, CardSkeleton, Carousel } from '@/components/ui';
import {
  getMovieDetails,
  getTVShowDetails,
  getCredits,
  getRecommendations,
  getBackdropUrl,
} from '@/lib/tmdb';

interface PageProps {
  params: Promise<{
    type: string;
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type, id } = await params;
  const numId = parseInt(id, 10);

  try {
    if (type === 'movie') {
      const movie = await getMovieDetails(numId);
      return {
        title: movie.title,
        description: movie.overview,
        openGraph: {
          title: movie.title,
          description: movie.overview,
          images: movie.backdrop_path
            ? [getBackdropUrl(movie.backdrop_path, 'w1280')]
            : [],
        },
      };
    } else if (type === 'tv') {
      const show = await getTVShowDetails(numId);
      return {
        title: show.name,
        description: show.overview,
        openGraph: {
          title: show.name,
          description: show.overview,
          images: show.backdrop_path
            ? [getBackdropUrl(show.backdrop_path, 'w1280')]
            : [],
        },
      };
    }
  } catch {
    // Return default metadata on error
  }

  return {
    title: 'Watch Now',
  };
}

async function MediaDetails({ type, id }: { type: 'movie' | 'tv'; id: number }) {
  const [details, credits] = await Promise.all([
    type === 'movie' ? getMovieDetails(id) : getTVShowDetails(id),
    getCredits(type, id),
  ]);

  const title = 'title' in details ? details.title : details.name;
  const releaseDate = 'release_date' in details ? details.release_date : details.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;
  const runtime = 'runtime' in details ? details.runtime : null;
  const director = credits.crew.find(p => p.job === 'Director');
  const topCast = credits.cast.slice(0, 6);

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-8">
      {/* Player */}
      <div>
        <VideoPlayer
          tmdbId={id}
          mediaType={type}
          season={type === 'tv' ? 1 : undefined}
          episode={type === 'tv' ? 1 : undefined}
          posterPath={details.poster_path}
          title={title}
        />
      </div>

      {/* Info Panel */}
      <div className="space-y-6">
        <div>
          <h1 className="text-[var(--text-2xl)] font-bold mb-2">{title}</h1>

          <div className="flex flex-wrap gap-2 mb-4 text-[var(--text-sm)]">
            {year && (
              <span className="px-2 py-1 rounded-[var(--radius-sm)] bg-white/10">
                {year}
              </span>
            )}
            {runtime && (
              <span className="px-2 py-1 rounded-[var(--radius-sm)] bg-white/10">
                {Math.floor(runtime / 60)}h {runtime % 60}m
              </span>
            )}
            {details.vote_average > 0 && (
              <span className="flex items-center gap-1 text-[var(--accent)]">
                <span>★</span>
                <span>{details.vote_average.toFixed(1)}</span>
              </span>
            )}
          </div>

          {details.genres && details.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {details.genres.map(genre => (
                <span
                  key={genre.id}
                  className="px-3 py-1 text-xs rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)]"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-[var(--text-lg)] font-semibold mb-2">Overview</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            {details.overview || 'No overview available.'}
          </p>
        </div>

        {director && (
          <div>
            <h2 className="text-[var(--text-lg)] font-semibold mb-2">Director</h2>
            <p className="text-[var(--text-secondary)]">{director.name}</p>
          </div>
        )}

        {topCast.length > 0 && (
          <div>
            <h2 className="text-[var(--text-lg)] font-semibold mb-3">Cast</h2>
            <div className="grid grid-cols-2 gap-2">
              {topCast.map(person => (
                <div key={person.id} className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--bg-elevated)] flex-shrink-0">
                    {person.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                        alt={person.name}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] text-xs">
                        ?
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{person.name}</p>
                    {person.character && (
                      <p className="text-xs text-[var(--text-muted)] truncate">
                        {person.character}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

async function RecommendationsSection({ type, id }: { type: 'movie' | 'tv'; id: number }) {
  const recommendations = await getRecommendations(type, id);

  if (recommendations.length === 0) return null;

  return (
    <Carousel title="You May Also Like">
      {recommendations.map(item => (
        <Card
          key={item.id}
          id={item.id}
          title={item.title}
          posterPath={item.posterPath}
          mediaType={type}
          rating={item.voteAverage}
        />
      ))}
    </Carousel>
  );
}

function DetailsSkeleton() {
  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-8">
      <div className="aspect-video skeleton rounded-[var(--radius-md)]" />
      <div className="space-y-6">
        <div className="h-10 w-3/4 skeleton rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-16 skeleton rounded" />
          <div className="h-8 w-20 skeleton rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full skeleton rounded" />
          <div className="h-4 w-full skeleton rounded" />
          <div className="h-4 w-3/4 skeleton rounded" />
        </div>
      </div>
    </div>
  );
}

function RecommendationsSkeleton() {
  return (
    <section className="py-4">
      <h2 className="text-[var(--text-xl)] font-bold mb-4 px-[4vw]">
        You May Also Like
      </h2>
      <div className="flex gap-4 px-[4vw] overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

export default async function WatchPage({ params }: PageProps) {
  const { type, id } = await params;

  // Validate params
  if (type !== 'movie' && type !== 'tv') {
    notFound();
  }

  const numId = parseInt(id, 10);
  if (isNaN(numId)) {
    notFound();
  }

  return (
    <div className="min-h-screen py-8">
      {/* Main Content */}
      <div className="px-[4vw] mb-12">
        <Suspense fallback={<DetailsSkeleton />}>
          <MediaDetails type={type} id={numId} />
        </Suspense>
      </div>

      {/* Recommendations */}
      <Suspense fallback={<RecommendationsSkeleton />}>
        <RecommendationsSection type={type} id={numId} />
      </Suspense>
    </div>
  );
}
