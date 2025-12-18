# Testing Strategy

## Principles (MCAF)

- **Real Dependencies**: Internal systems (state, routing) are not mocked. External systems (TMDB, Embeds) are replaced only because they cannot run locally.
- **Layered Verification**: We rely on high-level tests (Integration/E2E) to prove behaviour, not just unit/implementation tests.
- **Coverage**: Goals depend on risk. Critical user flows must have E2E coverage.

## Test Pyramid

```
        ┌─────────────┐
        │    E2E      │  Playwright - Critical user flows (Playback, Search)
        ├─────────────┤
        │ Integration │  Vitest - Component interactions, API routes
        ├─────────────┤
        │    Unit     │  Vitest - Pure logic (helpers, transformers)
        └─────────────┘
```

## Test Suites

### Unit Tests (`tests/unit/`)
- **Scope**: Pure functions, type guards, data normalizers.
- **Mocks**: None.
- **Tools**: Vitest.

### Integration Tests (`tests/integration/`)
- **Scope**: Components rendering with real state (Zustand) and API handling.
- **Mocks**:
  - TMDB API (via MSW or fetch mock) - External dependency.
  - VideoPlayer (iframe stub) - Third-party controllable dependency.
- **Tools**: Vitest + React Testing Library.

### E2E Tests (`tests/e2e/`)
- **Scope**: Full browser flows against running dev server.
- **Mocks**: Minimal. Network intersept for TMDB to ensure deterministic runs.
- **Tools**: Playwright.

## Running Tests

```bash
# Run all unit/integration tests
npm run test

# Run E2E tests (requires dev server)
npm run test:e2e
```

## Definition of Done (Testing)

- [ ] Happy path covered (e.g., Movie loads, plays).
- [ ] Negative path covered (e.g., 404, Search no results).
- [ ] No fragile mocks (e.g., mocking `useState` or internal hooks).
