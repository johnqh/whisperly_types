# @sudobility/whisperly_types

Shared TypeScript type definitions for the Whisperly localization SaaS platform.

## Installation

```bash
bun add @sudobility/whisperly_types
```

## Usage

```typescript
import {
  Project,
  TranslationRequest,
  TranslationResponse,
  successResponse,
  errorResponse,
} from "@sudobility/whisperly_types";

const response = successResponse({ translations: { es: ["Hola"] } });
```

## Types

### Entity Types
`User`, `UserSettings`, `Project`, `Dictionary`, `DictionaryEntry`, `UsageRecord`

### Request Types
`ProjectCreateRequest`, `ProjectUpdateRequest`, `DictionaryCreateRequest`, `TranslationRequest`

### Response Types
`ProjectResponse`, `ProjectListResponse`, `TranslationApiResponse`, `AnalyticsApiResponse`, `DictionarySearchApiResponse`

### Response Helpers
- `successResponse<T>(data)` -- wrap data in `BaseResponse<T>`
- `errorResponse(error)` -- create error response

## Development

```bash
bun run build        # Dual CJS + ESM build
bun run test:run     # Run tests once
bun run verify       # All checks + build
```

## Related Packages

- `whisperly_client` -- API client SDK
- `whisperly_lib` -- Business logic with Zustand stores
- `whisperly_api` -- Backend API server
- `whisperly_app` -- Web application

## License

BUSL-1.1
