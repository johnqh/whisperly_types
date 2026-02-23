# Improvement Plans for @sudobility/whisperly_types

## Priority 1 - High Impact

### 1. Add JSDoc Comments to All Entity Types and Request Types
- The majority of interfaces (`User`, `UserSettings`, `Project`, `Dictionary`, `DictionaryEntry`, `UsageRecord`) lack JSDoc comments explaining their purpose, which fields are primary keys, and what the expected data formats are.
- Request types (`UserCreateRequest`, `UserUpdateRequest`, `ProjectCreateRequest`, `ProjectUpdateRequest`, `UserSettingsUpdateRequest`) have no JSDoc explaining what each field represents or constraints (e.g., max lengths, required formats).
- Query parameter types (`ProjectQueryParams`, `UsageAnalyticsQueryParams`) have no documentation on expected date formats or filter behaviors.
- Only `TranslationServicePayload`, `TranslationServiceResponse`, `DictionaryTranslations`, and `TranslationRequest.skip_dictionaries` currently have JSDoc.
- Adding JSDoc would improve IDE autocomplete hints and serve as inline API documentation for all downstream consumers (whisperly_client, whisperly_lib, whisperly_app).

### 2. Add Runtime Validation with Zod Schemas
- All types are currently compile-time only, meaning invalid data from the API passes through silently until it causes runtime errors downstream.
- Adding Zod schemas alongside each interface would enable runtime validation at API boundaries (especially useful in `whisperly_client` when parsing responses).
- Key candidates: `TranslationRequest` (validate `strings` is non-empty, `target_languages` is non-empty), `ProjectCreateRequest` (validate `project_name` format), `AnalyticsResponse` (validate numeric fields are non-negative).
- The package already has Zod as a transitive dependency in the ecosystem, so the addition would be lightweight.

### 3. Expand Test Coverage for Type Shapes
- Current tests in `__tests__/index.test.ts` and `__tests__/types.test.ts` cover response helpers and basic type shapes, but do not validate edge cases.
- Missing test scenarios: `successResponse` and `errorResponse` with various data types (arrays, nested objects, null), `DictionaryTranslations` with empty objects, `RateLimitStatus` with zero remaining values.
- No tests verify that the response type aliases (`ProjectListResponse`, `AnalyticsApiResponse`, etc.) correctly compose with `BaseResponse<T>`.

## Priority 2 - Medium Impact

### 3. Introduce Branded Types for ID Fields
- Multiple interfaces use plain `string` for ID fields (`firebase_uid`, `id`, `entity_id`, `project_id`, `dictionary_id`), making it easy to accidentally pass a project ID where an entity ID is expected.
- Branded/tagged types (e.g., `type ProjectId = string & { __brand: 'ProjectId' }`) would provide compile-time safety at zero runtime cost.
- This would particularly benefit `whisperly_client` where methods take multiple string ID parameters (`entitySlug`, `projectId`, `dictionaryId`).

### 4. Normalize Date Handling Across Types
- Entity types use `Date | null` for timestamps, while `UsageAggregate` uses `string` for `period_start` and `period_end`, and `UsageByDate` uses `string` for `date`.
- `AvailableLanguage` has no date field but `RateLimitStatus.resets_at` uses `string` for ISO timestamps.
- A consistent approach (e.g., always `string` for serialized forms, always `Date` for entity forms, or a documented `ISODateString` type alias) would reduce confusion for consumers.

### 5. Add `verify` Script to Include Test Run
- The `verify` script currently runs `typecheck + lint + test + build` according to CLAUDE.md, but test files exist in `__tests__/` that should be confirmed as part of CI.
- Ensure the `verify` script is the single source of truth for pre-commit validation across the ecosystem.

## Priority 3 - Nice to Have

### 6. Split index.ts Into Domain-Specific Modules
- The single `src/index.ts` file contains all 13 sections of types (352 lines). While manageable now, adding more types (e.g., team management, billing, webhooks) would make the file unwieldy.
- Splitting into `src/entities.ts`, `src/requests.ts`, `src/responses.ts`, `src/analytics.ts`, `src/translation.ts` with a barrel re-export would improve navigation.
- This is purely organizational and would not affect the public API.

### 7. Add Deprecation Markers for Legacy Fields
- `UserSettings.organization_path` is noted as "Legacy personal org paths" in CLAUDE.md but has no `@deprecated` JSDoc tag in the source code.
- Adding `@deprecated` tags would trigger IDE warnings in downstream consumers still referencing legacy fields.

### 8. Document Enum-Like String Constants
- Several types use string literals implicitly (e.g., `RateLimitStatus.tier` is typed as `string` but likely has a finite set of values like `'free' | 'pro' | 'enterprise'`).
- Tightening these to union types or documenting expected values would improve type safety.
