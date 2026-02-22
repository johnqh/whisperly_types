# CLAUDE.md - whisperly_types

## Project Overview

`@sudobility/whisperly_types` is the shared TypeScript types library for the Whisperly localization SaaS platform. It defines all interfaces, request/response types, and helper functions consumed by all other whisperly packages (whisperly_api, whisperly_client, whisperly_lib, whisperly_app).

**Platform**: Universal (Web, React Native, Backend) — dual ESM/CJS output, zero runtime dependencies.

## Package Manager

**Bun** (not npm/yarn): `bun install`, `bun run <script>`, `bun add <package>`

## Project Structure

```
src/
├── index.ts              # All type definitions and helper functions (single file)
└── __tests__/
    ├── index.test.ts     # Response helper function tests
    └── types.test.ts     # Type shape validation tests
```

## Key Scripts

```bash
bun run build        # Build ESM + CJS to dist/
bun run typecheck    # TypeScript type checking
bun run lint         # ESLint
bun run test:run     # Run tests once
bun run verify       # typecheck + lint + test + build (use before committing)
```

## Type Organization (in index.ts)

All types are in a single file, organized by section:

### 1. Re-exports from @sudobility/types
`ApiResponse`, `BaseResponse`, `NetworkClient`, `Optional`, `PaginatedResponse`, `PaginationInfo`, `PaginationOptions`

### 2. Entity Types (database models)
| Type | Key Fields | Notes |
|------|-----------|-------|
| `User` | firebase_uid, email, display_name | PK is firebase_uid |
| `UserSettings` | firebase_uid, organization_path | Legacy personal org paths |
| `Project` | id, entity_id, project_name, display_name, api_key, ip_allowlist | Entity-scoped |
| `Dictionary` | id, entity_id, project_id | Container for entries |
| `DictionaryEntry` | id, dictionary_id, language_code, text | Individual translation |
| `DictionaryTranslations` | `Record<string, string>` | Flattened `{ "en": "hello", "es": "hola" }` |
| `UsageRecord` | uuid, entity_id, project_id, request_count, character_count | Analytics tracking |

### 3. Request Types
- `UserCreateRequest`, `UserUpdateRequest`
- `UserSettingsUpdateRequest`
- `ProjectCreateRequest`, `ProjectUpdateRequest`
- `DictionaryCreateRequest`, `DictionaryUpdateRequest` — both are `DictionaryTranslations` (direct `{ lang: text }` payload)

### 4. Query Parameter Types
- `ProjectQueryParams` — `is_active` filter
- `UsageAnalyticsQueryParams` — `project_id`, `start_date`, `end_date`, `success` filters

### 5. Translation API Types
- `TranslationRequest` — `strings[]`, `target_languages[]`, optional `source_language`, `skip_dictionaries`
- `TranslationResponse` — `translations: Record<lang, string[]>`, `dictionary_terms_used[]`, `request_id`

### 6. Dictionary Callback Types
- `DictionaryLookupRequest` — `term`, `languages` (for translation service GET callback)
- `DictionaryLookupResponse` — `term`, `translations: Record<lang, string | null>`

### 7. Dictionary Search
- `DictionarySearchResponse` — `dictionary_id`, `translations: DictionaryTranslations`

### 8. Analytics Types
- `UsageAggregate` — totals, success rate, period range
- `UsageByProject` — per-project breakdown
- `UsageByDate` — daily breakdown
- `AnalyticsResponse` — composite of all three

### 9. Project Languages
- `AvailableLanguage` — `language_code`, `language`, `flag`
- `ProjectLanguagesResponse` — `project_id`, `languages` (comma-separated string)

### 10. Rate Limit Types
- `RateLimitStatus` — tier, monthly/hourly limits+used+remaining, resets_at

### 11. Translation Service Types (internal)
- `TranslationServicePayload` — payload for external translation service
- `TranslationServiceResponse` — response from external translation service

### 12. Response Helpers
- `successResponse<T>(data)` → `BaseResponse<T>` with `success: true`
- `errorResponse(error)` → `BaseResponse<never>` with `success: false`

### 13. Response Type Aliases
`ProjectListResponse`, `ProjectResponse`, `UserSettingsResponse`, `RateLimitResponse`, `DictionaryResponse`, `DictionarySearchApiResponse`, `DictionaryLookupApiResponse`, `AnalyticsApiResponse`, `TranslationApiResponse`, `AvailableLanguagesApiResponse`, `ProjectLanguagesApiResponse`, `HealthCheckResponse`

## Conventions

- Entity types match database schema exactly
- All dates are `Date | null` in entities
- Request types use `Optional<T>` from @sudobility/types for optional fields
- Update requests make all fields `Optional<T>` (partial updates)
- Response types are wrapped with `BaseResponse<T>`
- Response naming: `EntityResponse` (single), `EntityListResponse` (array), `*ApiResponse` (special)

## Adding New Types

1. Add interface to `src/index.ts` in the appropriate section
2. Add response type alias if used in API (e.g., `type FooResponse = BaseResponse<Foo>`)
3. Add test cases in `src/__tests__/types.test.ts`
4. Run `bun run verify`

## Dependencies

- `@sudobility/types` — peer dependency providing `BaseResponse`, `Optional`, etc.
- Zero runtime dependencies

## Build Output

- `dist/index.js` — ESM module
- `dist/index.cjs` — CommonJS module
- `dist/index.d.ts` — TypeScript declarations
