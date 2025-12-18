# Feature: Core Streaming

Status: Implemented
Owner: Wyvern Stream Team
Created: 2024-12-18
Links: N/A

---

## Purpose

To enable users to discover, browse, and watch movies and TV shows via a premium, Netflix-like interface powered by TMDB metadata and third-party HTTP embed providers.

---

## Scope

### In scope

- Content discovery (Trending, Popular, Top Rated)
- Search functionality (Movies & TV)
- Detailed metadata view (Cast, Crew, Overview)
- Video playback via third-party embeds
- Provider switching mechanism

### Out of scope

- User authentication (Phase 7)
- Watchlist/History (Phase 7)
- Payment/Subscription
- Self-hosted content

---

## Business Rules

- **No Torrenting:** All content must be delivered via HTTP embeds.
- **Provider Fallback:** Users must be able to switch providers if one fails.
- **Visual Excellence:** Interface must use glassmorphism and fluid typography.
- **Mobile First:** Must work on mobile devices (touch targets > 44px).

---

## User Flows

### Primary flows

1. **Watch Movie**
   - Actor: Guest User
   - Trigger: Clicks "Watch Now" on Movie Detail page
   - Steps:
     1. User navigates to `/movie/[id]`
     2. Page fetches metadata from TMDB
     3. User clicks "Watch Now" (or play icon)
     4. `VideoPlayer` mounts with default provider
   - Result: Video plays in iframe

2. **Switch Provider**
   - Actor: Guest User
   - Trigger: Video fails to load or buffers
   - Steps:
     1. User clicks a different provider button (e.g., "VidSrc.me") above player
     2. `VideoPlayer` updates state
     3. Iframe src changes to new provider URL
   - Result: Video reloads from new source

### Edge cases

- **Content Not Found:** TMDB ID invalid → Show 404 Page
- **No Provider Available:** All embeds fail → User sees error/fallback message (manual check required)

---

## System Behaviour

- Entry points: `/`, `/movie/[id]`, `/tv/[id]`, `/search`
- Reads from: TMDB API (cached via ISR), Embed Provider URLs
- Writes to: LocalStorage (for simple state), Supabase (Future)
- Side effects / emitted events: None currently.
- Idempotency: Yes (Reading data).
- Error handling: UI shows error states for failed API calls or missing videos.
- Security / permissions: Public access.
- Feature flags / toggles: None.
- Performance / SLAs: Pages load < 1.5s (LCP). Video load depends on provider.
- Observability: Console logs for development.

---

## Diagrams

```mermaid
graph TD
    User[User] -->|Navigates| Home[Homepage]
    Home -->|Fetches| TMDB[TMDB API]
    User -->|Clicks Title| Detail[Detail Page]
    Detail -->|Fetches| TMDB
    Detail -->|Mounts| Player[VideoPlayer]
    Player -->|Embeds| Provider[Embed Provider (SuperEmbed/VidSrc)]
    User -->|Selects| Switch[Provider Switcher]
    Switch -->|Updates| Player
```

---

## Verification (Mandatory: describe how to test)

### Test environment

- Environment / stack: Local dev (Next.js)
- Data and reset strategy: N/A (Read-only)
- External dependencies: TMDB API, Embed Providers

### Test commands

- build: `npm run build`
- test: `npm run test`
- format: `npx prettier --write .`

### Test flows

**Positive scenarios**

| ID | Description | Level (Unit / Int / API / UI) | Expected result | Data / Notes |
| --- | --- | --- | --- | --- |
| POS-001 | Homepage Loads | UI | Hero and carousels visible | |
| POS-002 | Search works | UI/API | Results match query | Query: "Inception" |
| POS-003 | Player Loads | UI | Iframe present with src | |

**Negative scenarios**

| ID | Description | Level (Unit / Int / API / UI) | Expected result | Data / Notes |
| --- | --- | --- | --- | --- |
| NEG-001 | Invalid ID | UI | 404 Page | /movie/99999999 |
| NEG-002 | Search Empty | UI | Empty state message | Query: "" |

**Edge cases**

| ID | Description | Level (Unit / Int / API / UI) | Expected result | Data / Notes |
| --- | --- | --- | --- | --- |
| EDGE-001 | Mobile Viewport | UI | Menu collapses, touch targets OK | |

### Test mapping

- Integration tests: `tests/integration/tmdb.test.ts` (Planned)
- API tests: `tests/api/search.test.ts` (Planned)
- UI / E2E tests: `tests/e2e/playback.spec.ts` (Planned)
- Unit tests: `tests/unit/utils.test.ts` (Planned)
- Static analysis: ESLint

### Non-functional checks (if applicable)

- Performance / load: Lighthouse score > 90
- Security / privacy: No mixed content warnings

---

## Definition of Done

- Behaviour matches rules and flows in this document.
- All test flows above are covered by automated tests (Integration / API / UI as applicable).
- Static analysis passes with no new unresolved issues.
- Test and build commands listed above run clean in local and CI environments.
- Documentation updated: related ADRs, Testing / API / Architecture docs.
- Feature flags / migrations rolled out or cleaned up.

---

## References

- ADRs: [ADR-001](file:///d%3A/COMPROG/Wyvern%20Stream/wyvern-stream/docs/ADR/001-vidking-only.md)
- API: TMDB API Docs
- Architecture: Next.js App Router
- Testing: [Strategy](file:///d%3A/COMPROG/Wyvern%20Stream/wyvern-stream/docs/Testing/strategy.md)
- Code: `src/components/player`, `src/lib/tmdb.ts`
