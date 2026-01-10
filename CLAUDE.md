# CLAUDE.md - whisperly_types

## Project Overview
`@sudobility/whisperly_types` is a TypeScript types library that defines all shared types, interfaces, and schemas for the Whisperly localization SaaS platform. This package is consumed by both the API (whisperly_api) and client packages (whisperly_client, whisperly_lib, whisperly_app).

## Platform Support
- **Web App**: Yes
- **React Native**: Yes
- **Backend (Node.js/Bun)**: Yes

This is a universal types package with dual ESM/CJS output for maximum compatibility.

## Tech Stack
- **Runtime**: Bun
- **Language**: TypeScript 5.9+
- **Build**: Dual ESM/CJS output
- **Testing**: Vitest
- **Linting**: ESLint 9 with TypeScript support
- **Formatting**: Prettier

## Package Manager
**IMPORTANT**: This project uses **Bun**, not npm or yarn.
- Install dependencies: `bun install`
- Run scripts: `bun run <script>`
- Add dependencies: `bun add <package>` or `bun add -d <package>` for dev

## Project Structure
```
src/
├── index.ts           # Main barrel file with all type exports
└── __tests__/
    ├── index.test.ts  # Response helper tests
    └── types.test.ts  # Type shape validation tests
```

## Key Scripts
```bash
bun run build        # Build ESM and CJS outputs
bun run typecheck    # Run TypeScript type checking
bun run lint         # Run ESLint
bun run test         # Run tests in watch mode
bun run test:run     # Run tests once
bun run verify       # Run typecheck + lint + test + build
```

## Type Categories
The package exports types organized into these categories:

1. **Entity Types** (database models): `User`, `UserSettings`, `Project`, `Glossary`, `Subscription`, `UsageRecord`
2. **Request Types**: `*CreateRequest`, `*UpdateRequest` for each entity
3. **Query Params**: `ProjectQueryParams`, `GlossaryQueryParams`, `UsageAnalyticsQueryParams`
4. **Translation Types**: `TranslationRequest`, `TranslationResponse`, `GlossaryLookupRequest/Response`
5. **Analytics Types**: `UsageAggregate`, `UsageByProject`, `UsageByDate`, `AnalyticsResponse`
6. **Rate Limit Types**: `RateLimitStatus`, `SubscriptionTier`
7. **Response Helpers**: `successResponse<T>()`, `errorResponse()`
8. **Response Type Aliases**: `ProjectResponse`, `GlossaryResponse`, etc.

## Development Guidelines

### Adding New Types
1. Add types to `src/index.ts` in the appropriate section
2. Add corresponding tests in `src/__tests__/types.test.ts`
3. Run `bun run verify` before committing

### Type Conventions
- Entity types match database schema exactly
- Request types use `Optional<T>` for optional fields (re-exported from @sudobility/types)
- Response types are wrapped with `BaseResponse<T>`
- All dates are `Date | null` in entities

### Testing Types
Tests validate type shapes at runtime to catch breaking changes:
```typescript
const project: Project = {
  id: '123',
  user_id: '456',
  // ... all required fields
};
expect(project.id).toBe('123');
```

## Dependencies
- `@sudobility/types` - Base types (ApiResponse, BaseResponse, etc.)

## Build Output
- `dist/index.js` - ESM module
- `dist/index.cjs` - CommonJS module
- `dist/index.d.ts` - Type declarations
