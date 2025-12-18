import { Suspense } from 'react';
import { Hero, HeroSkeleton } from '@/components/layout';
import { Card, CardSkeleton, Carousel } from '@/components/ui';
import {
  getTrending,
  getPopularMovies,
  getPopularTVShows,
  getTopRatedMovies,
} from '@/lib/tmdb';

// Force dynamic rendering to use ISR caching
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

async function HeroSection() {
  const trending = await getTrending('all', 'day');
  const featured = trending[0];

  if (!featured) {
    return <HeroSkeleton />;
  }

  return (
    <Hero
      id={featured.id}
      title={featured.title}
      overview={featured.overview}
      backdropPath={featured.backdropPath}
      mediaType={featured.mediaType}
      releaseDate={featured.releaseDate}
      voteAverage={featured.voteAverage}
    />
  );
}

async function TrendingCarousel() {
  const items = await getTrending('all', 'day');

  return (
    <Carousel title="🔥 Trending Today">
      {items.slice(1).map((item) => (
        <Card
          key={`${item.mediaType}-${item.id}`}
          id={item.id}
          title={item.title}
          posterPath={item.posterPath}
          mediaType={item.mediaType}
          rating={item.voteAverage}
        />
      ))}
    </Carousel>
  );
}

async function PopularMoviesCarousel() {
  const items = await getPopularMovies();

  return (
    <Carousel title="🎬 Popular Movies">
      {items.map((item) => (
        <Card
          key={item.id}
          id={item.id}
          title={item.title}
          posterPath={item.posterPath}
          mediaType="movie"
          rating={item.voteAverage}
        />
      ))}
    </Carousel>
  );
}

async function PopularTVCarousel() {
  const items = await getPopularTVShows();

  return (
    <Carousel title="📺 Popular TV Shows">
      {items.map((item) => (
        <Card
          key={item.id}
          id={item.id}
          title={item.title}
          posterPath={item.posterPath}
          mediaType="tv"
          rating={item.voteAverage}
        />
      ))}
    </Carousel>
  );
}

async function TopRatedCarousel() {
  const items = await getTopRatedMovies();

  return (
    <Carousel title="⭐ Top Rated">
      {items.map((item) => (
        <Card
          key={item.id}
          id={item.id}
          title={item.title}
          posterPath={item.posterPath}
          mediaType="movie"
          rating={item.voteAverage}
        />
      ))}
    </Carousel>
  );
}

function CarouselSkeleton({ title }: { title: string }) {
  return (
    <section className="py-4">
      <h2 className="text-[var(--text-xl)] font-bold text-[var(--text-primary)] mb-4 px-[4vw]">
        {title}
      </h2>
      <div className="flex gap-4 px-[4vw] overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      {/* Content Carousels */}
      <div className="-mt-20 relative z-10 space-y-2">
        <Suspense fallback={<CarouselSkeleton title="🔥 Trending Today" />}>
          <TrendingCarousel />
        </Suspense>

        <Suspense fallback={<CarouselSkeleton title="🎬 Popular Movies" />}>
          <PopularMoviesCarousel />
        </Suspense>

        <Suspense fallback={<CarouselSkeleton title="📺 Popular TV Shows" />}>
          <PopularTVCarousel />
        </Suspense>

        <Suspense fallback={<CarouselSkeleton title="⭐ Top Rated" />}>
          <TopRatedCarousel />
        </Suspense>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 px-[4vw] border-t border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto text-center text-[var(--text-muted)] text-sm">
          <p className="mb-2">
            This site does not store any files on its server. All contents are provided by non-affiliated third parties.
          </p>
          <p>
            Data provided by{' '}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:underline"
            >
              TMDB
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
