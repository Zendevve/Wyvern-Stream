import {
  TMDBMovie,
  TMDBTVShow,
  TMDBResponse,
  TMDBSearchResult,
  TMDBCredits,
  TMDBSeason,
  MediaItem,
  normalizeMovie,
  normalizeTVShow,
} from '@/types/tmdb';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!TMDB_API_KEY) {
  console.warn('⚠️ TMDB_API_KEY is not set. API calls will fail.');
}

interface FetchOptions {
  revalidate?: number;
}

async function tmdbFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${TMDB_API_KEY}`;

  const res = await fetch(url, {
    next: { revalidate: options.revalidate ?? 3600 }, // Cache for 1 hour by default
  });

  if (!res.ok) {
    throw new Error(`TMDB API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// ============================================================================
// Trending & Popular
// ============================================================================

export async function getTrending(
  mediaType: 'all' | 'movie' | 'tv' = 'all',
  timeWindow: 'day' | 'week' = 'day'
): Promise<MediaItem[]> {
  const data = await tmdbFetch<TMDBResponse<TMDBMovie | TMDBTVShow>>(
    `/trending/${mediaType}/${timeWindow}`,
    { revalidate: 3600 }
  );

  return data.results.map((item) => {
    if ('title' in item) {
      return normalizeMovie(item as TMDBMovie);
    }
    return normalizeTVShow(item as TMDBTVShow);
  });
}

export async function getPopularMovies(): Promise<MediaItem[]> {
  const data = await tmdbFetch<TMDBResponse<TMDBMovie>>(
    '/movie/popular',
    { revalidate: 3600 }
  );

  return data.results.map(normalizeMovie);
}

export async function getPopularTVShows(): Promise<MediaItem[]> {
  const data = await tmdbFetch<TMDBResponse<TMDBTVShow>>(
    '/tv/popular',
    { revalidate: 3600 }
  );

  return data.results.map(normalizeTVShow);
}

export async function getTopRatedMovies(): Promise<MediaItem[]> {
  const data = await tmdbFetch<TMDBResponse<TMDBMovie>>(
    '/movie/top_rated',
    { revalidate: 86400 } // Cache for 24 hours
  );

  return data.results.map(normalizeMovie);
}

export async function getTopRatedTVShows(): Promise<MediaItem[]> {
  const data = await tmdbFetch<TMDBResponse<TMDBTVShow>>(
    '/tv/top_rated',
    { revalidate: 86400 }
  );

  return data.results.map(normalizeTVShow);
}

// ============================================================================
// Details
// ============================================================================

export async function getMovieDetails(id: number): Promise<TMDBMovie> {
  return tmdbFetch<TMDBMovie>(
    `/movie/${id}`,
    { revalidate: 86400 }
  );
}

export async function getTVShowDetails(id: number): Promise<TMDBTVShow> {
  return tmdbFetch<TMDBTVShow>(
    `/tv/${id}`,
    { revalidate: 86400 }
  );
}

export async function getCredits(
  mediaType: 'movie' | 'tv',
  id: number
): Promise<TMDBCredits> {
  return tmdbFetch<TMDBCredits>(
    `/${mediaType}/${id}/credits`,
    { revalidate: 86400 }
  );
}

export async function getTVSeasons(id: number): Promise<TMDBSeason[]> {
  const show = await getTVShowDetails(id);
  // The seasons are included in the TV show details
  // We need to fetch each season for episode details
  return (show as TMDBTVShow & { seasons: TMDBSeason[] }).seasons || [];
}

export async function getSeasonDetails(
  showId: number,
  seasonNumber: number
): Promise<{ episodes: { id: number; name: string; episode_number: number; still_path: string | null }[] }> {
  return tmdbFetch(
    `/tv/${showId}/season/${seasonNumber}`,
    { revalidate: 86400 }
  );
}

// ============================================================================
// Search
// ============================================================================

export async function searchMulti(query: string): Promise<MediaItem[]> {
  if (!query.trim()) return [];

  const data = await tmdbFetch<TMDBResponse<TMDBSearchResult>>(
    `/search/multi?query=${encodeURIComponent(query)}`,
    { revalidate: 0 } // Don't cache search results
  );

  return data.results
    .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
    .map((item) => ({
      id: item.id,
      title: item.title || item.name || 'Unknown',
      posterPath: item.poster_path,
      backdropPath: item.backdrop_path || null,
      overview: item.overview || '',
      releaseDate: item.release_date || item.first_air_date || '',
      voteAverage: item.vote_average || 0,
      mediaType: item.media_type as 'movie' | 'tv',
    }));
}

// ============================================================================
// Recommendations
// ============================================================================

export async function getRecommendations(
  mediaType: 'movie' | 'tv',
  id: number
): Promise<MediaItem[]> {
  const data = await tmdbFetch<TMDBResponse<TMDBMovie | TMDBTVShow>>(
    `/${mediaType}/${id}/recommendations`,
    { revalidate: 86400 }
  );

  return data.results.map((item) => {
    if ('title' in item) {
      return normalizeMovie(item as TMDBMovie);
    }
    return normalizeTVShow(item as TMDBTVShow);
  });
}

// ============================================================================
// Image URLs
// ============================================================================

export function getPosterUrl(path: string | null, size: 'w185' | 'w342' | 'w500' | 'w780' = 'w342'): string {
  if (!path) return '/placeholder-poster.svg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function getBackdropUrl(path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280'): string {
  if (!path) return '';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
