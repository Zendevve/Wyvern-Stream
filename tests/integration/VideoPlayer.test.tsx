import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VideoPlayer } from '@/components/player/VideoPlayer';

// Mock Next.js Image
vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

describe('VideoPlayer Integration', () => {
  const defaultProps = {
    tmdbId: 123,
    mediaType: 'movie' as const,
    title: 'Test Movie',
  };

  it('renders provider selector buttons', () => {
    render(<VideoPlayer {...defaultProps} />);

    expect(screen.getByText('SuperEmbed ⭐')).toBeInTheDocument();
    expect(screen.getByText('VidSrc.me')).toBeInTheDocument();
    expect(screen.getByText('Nontongo')).toBeInTheDocument();
  });

  it('defaults to SuperEmbed', () => {
    render(<VideoPlayer {...defaultProps} />);

    // Check if the first button is active (has accent color class usually, or checked via logic)
    // We can also check the iframe src
    const iframe = screen.getByTitle('Watch Test Movie') as HTMLIFrameElement;
    expect(iframe.src).toContain('multiembed.mov');
  });

  it('switches provider when button is clicked', () => {
    render(<VideoPlayer {...defaultProps} />);

    // Click VidSrc.me button
    fireEvent.click(screen.getByText('VidSrc.me'));

    const iframe = screen.getByTitle('Watch Test Movie') as HTMLIFrameElement;
    expect(iframe.src).toContain('vidsrc.net');
  });

  it('switches to Nontongo', () => {
    render(<VideoPlayer {...defaultProps} />);

    fireEvent.click(screen.getByText('Nontongo'));

    const iframe = screen.getByTitle('Watch Test Movie') as HTMLIFrameElement;
    expect(iframe.src).toContain('nontongo.win');
  });
});
