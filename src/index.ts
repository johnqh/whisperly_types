/**
 * @sudobility/whisperly_types
 * TypeScript types for Whisperly API - Localization SaaS platform
 */

// Re-export common types from @sudobility/types
export type {
  ApiResponse,
  BaseResponse,
  NetworkClient,
  Optional,
  PaginatedResponse,
  PaginationInfo,
  PaginationOptions,
} from '@sudobility/types';

import type { Optional, BaseResponse } from '@sudobility/types';

// =============================================================================
// Entity Types (database models)
// =============================================================================

export interface User {
  firebase_uid: string;
  email: string | null;
  display_name: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface UserSettings {
  id: string | null;
  firebase_uid: string;
  organization_name: string | null;
  organization_path: string;
  is_default: boolean;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface Project {
  id: string;
  entity_id: string;
  project_name: string;
  display_name: string;
  description: string | null;
  instructions: string | null;
  default_source_language: string | null;
  default_target_languages: string[] | null;
  ip_allowlist: string[] | null;
  is_active: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface Dictionary {
  id: string;
  entity_id: string;
  project_id: string;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface DictionaryEntry {
  id: string;
  dictionary_id: string;
  language_code: string;
  text: string;
  created_at: Date | null;
  updated_at: Date | null;
}

/** Flattened dictionary translations: { language_code: text } */
export type DictionaryTranslations = Record<string, string>;

export interface UsageRecord {
  uuid: string;
  entity_id: string;
  project_id: string;
  timestamp: Date;
  request_count: number;
  string_count: number;
  character_count: number;
  success: boolean;
  error_message: string | null;
}

// =============================================================================
// Request Body Types
// =============================================================================

// User requests
export interface UserCreateRequest {
  firebase_uid: string;
  email: Optional<string>;
  display_name: Optional<string>;
}

export interface UserUpdateRequest {
  email: Optional<string>;
  display_name: Optional<string>;
}

// User Settings requests
export interface UserSettingsUpdateRequest {
  organization_name: Optional<string>;
  organization_path: Optional<string>;
}

// Project requests
export interface ProjectCreateRequest {
  project_name: string;
  display_name: string;
  description: Optional<string>;
  instructions: Optional<string>;
  default_source_language: Optional<string>;
  default_target_languages: Optional<string[]>;
  ip_allowlist: Optional<string[]>;
}

export interface ProjectUpdateRequest {
  project_name: Optional<string>;
  display_name: Optional<string>;
  description: Optional<string>;
  instructions: Optional<string>;
  default_source_language: Optional<string | null>;
  default_target_languages: Optional<string[] | null>;
  ip_allowlist: Optional<string[] | null>;
  is_active: Optional<boolean>;
}

// Dictionary requests - direct DictionaryTranslations payload
// API accepts { "en": "hello", "es": "hola" } directly, not wrapped
export type DictionaryCreateRequest = DictionaryTranslations;
export type DictionaryUpdateRequest = DictionaryTranslations;

// =============================================================================
// Query Parameter Types
// =============================================================================

export interface ProjectQueryParams {
  is_active: Optional<string>;
}

export interface UsageAnalyticsQueryParams {
  project_id: Optional<string>;
  start_date: Optional<string>;
  end_date: Optional<string>;
  success: Optional<string>;
}

// =============================================================================
// Translation API Types
// =============================================================================

export interface TranslationRequest {
  strings: string[];
  target_languages: string[];
  source_language: Optional<string>;
  /** Skip dictionary term matching/replacement. Set to true when translating dictionary entries. */
  skip_dictionaries?: boolean;
}

export interface TranslationResponse {
  translations: Record<string, string[]>;
  dictionary_terms_used: string[];
  request_id: string;
}

// =============================================================================
// Dictionary Callback Types (GET endpoint for translation service)
// =============================================================================

export interface DictionaryLookupRequest {
  term: string;
  languages: string;
}

export interface DictionaryLookupResponse {
  term: string;
  translations: Record<string, string | null>;
}

// =============================================================================
// Dictionary Search Response
// =============================================================================

export interface DictionarySearchResponse {
  dictionary_id: string;
  translations: DictionaryTranslations;
}

// =============================================================================
// Analytics Types
// =============================================================================

export interface UsageAggregate {
  total_requests: number;
  total_strings: number;
  total_characters: number;
  successful_requests: number;
  failed_requests: number;
  success_rate: number;
  period_start: string;
  period_end: string;
}

export interface UsageByProject {
  project_id: string;
  project_name: string;
  request_count: number;
  string_count: number;
  character_count: number;
  success_rate: number;
}

export interface UsageByDate {
  date: string;
  request_count: number;
  string_count: number;
  character_count: number;
}

export interface AnalyticsResponse {
  aggregate: UsageAggregate;
  by_project: UsageByProject[];
  by_date: UsageByDate[];
}

// =============================================================================
// Project Languages Types
// =============================================================================

export interface AvailableLanguage {
  language_code: string;
  language: string;
  flag: string;
}

export interface ProjectLanguagesResponse {
  project_id: string;
  languages: string; // comma-separated: "en,zh,ja"
}

// =============================================================================
// Rate Limit Types
// =============================================================================

export interface RateLimitStatus {
  tier: string;
  monthly_limit: number;
  monthly_used: number;
  monthly_remaining: number;
  hourly_limit: number;
  hourly_used: number;
  hourly_remaining: number;
  resets_at: {
    monthly: string;
    hourly: string;
  };
}

// =============================================================================
// Translation Service Types (internal - for calling external service)
// =============================================================================

/** Request payload for external translation service */
export interface TranslationServicePayload {
  /** List of text strings to translate */
  texts: string[];
  /** List of target language codes (e.g., "es", "fr", "de", "zh", "ja") */
  target_language_codes: string[];
  /** Optional context to help with translation */
  context?: string;
  /** Whether to preserve formatting like line breaks */
  preserve_formatting?: boolean;
  /** Source language code (optional, auto-detected if not provided) */
  source_language_code?: string;
}

/** Response from external translation service */
export interface TranslationServiceResponse {
  /** Array of arrays - for each input text, translations in each target language (in same order as target_language_codes) */
  translations: string[][];
  /** Detected source language code */
  detected_source_language?: string;
}

// =============================================================================
// Response Helper Functions
// =============================================================================

/** Create a success response */
export function successResponse<T>(data: T): BaseResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

/** Create an error response */
export function errorResponse(error: string): BaseResponse<never> {
  return {
    success: false,
    error,
    timestamp: new Date().toISOString(),
  };
}

// =============================================================================
// API Response Type Aliases (for FE client convenience)
// =============================================================================

// Entity list responses
export type ProjectListResponse = BaseResponse<Project[]>;

// Single entity responses
export type ProjectResponse = BaseResponse<Project>;
export type UserSettingsResponse = BaseResponse<UserSettings>;
export type RateLimitResponse = BaseResponse<RateLimitStatus>;

// Dictionary responses
export type DictionaryResponse = BaseResponse<DictionaryTranslations>;
export type DictionarySearchApiResponse = BaseResponse<DictionarySearchResponse>;
export type DictionaryLookupApiResponse = BaseResponse<DictionaryLookupResponse>;

// Analytics response
export type AnalyticsApiResponse = BaseResponse<AnalyticsResponse>;

// Translation responses
export type TranslationApiResponse = BaseResponse<TranslationResponse>;

// Project Languages responses
export type AvailableLanguagesApiResponse = BaseResponse<AvailableLanguage[]>;
export type ProjectLanguagesApiResponse = BaseResponse<ProjectLanguagesResponse>;

// Health check response
export type HealthCheckResponse = BaseResponse<HealthCheckData>;

// =============================================================================
// Health check response
// =============================================================================

export interface HealthCheckData {
  name: string;
  version: string;
  status: string;
}
