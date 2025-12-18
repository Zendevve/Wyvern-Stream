import { describe, it, expect } from 'vitest';
import { getBackdropUrl, getPosterUrl } from '@/lib/tmdb';

describe('TMDB Utils', () => {
  describe('getBackdropUrl', () => {
    it('returns empty string for null path', () => {
      expect(getBackdropUrl(null)).toBe('');
    });

    it('returns correct URL for valid path', () => {
      expect(getBackdropUrl('/test.jpg')).toBe('https://image.tmdb.org/t/p/w1280/test.jpg');
    });

    it('returns correct URL with custom size', () => {
      expect(getBackdropUrl('/test.jpg', 'original')).toBe('https://image.tmdb.org/t/p/original/test.jpg');
    });
  });

  describe('getPosterUrl', () => {
    it('returns placeholder for null path', () => {
      expect(getPosterUrl(null)).toBe('/placeholder-poster.svg');
    });

    it('returns correct URL for valid path', () => {
      expect(getPosterUrl('/poster.jpg')).toBe('https://image.tmdb.org/t/p/w342/poster.jpg');
    });

    it('returns correct URL with custom size', () => {
      expect(getPosterUrl('/poster.jpg', 'w780')).toBe('https://image.tmdb.org/t/p/w780/poster.jpg');
    });
  });
});
