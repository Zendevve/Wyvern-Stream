# Development Setup

## Prerequisites

- Node.js 18.18+ (recommended: 20 LTS)
- npm 9+

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd wyvern-stream

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# TMDB API (required)
TMDB_API_KEY=your_tmdb_api_key_here

# Supabase (optional - for user features)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get your TMDB API key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests (Vitest) |
| `npm run test:e2e` | Run E2E tests (Playwright) |

## Project Structure

```
wyvern-stream/
├── src/
│   ├── app/           # Next.js App Router pages
│   ├── components/    # React components
│   │   ├── ui/        # Base UI components
│   │   ├── layout/    # Layout components
│   │   └── player/    # Video player components
│   ├── lib/           # Utilities and API clients
│   ├── stores/        # Zustand state stores
│   └── types/         # TypeScript type definitions
├── docs/              # Documentation
├── tests/             # Test files
└── public/            # Static assets
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Video Source**: Vidking (iframe embed)
- **Metadata**: TMDB API
- **State**: Zustand
- **Auth/DB**: Supabase (optional)
