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
// Enum Types
// =============================================================================

export type HttpMethod = 'GET' | 'POST';

export type SubscriptionTier = 'starter' | 'pro' | 'enterprise';

// =============================================================================
// Entity Types (database models)
// =============================================================================

export interface User {
  id: string;
  firebase_uid: string;
  email: string | null;
  display_name: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface UserSettings {
  id: string | null;
  user_id: string;
  organization_name: string | null;
  organization_path: string;
  is_default: boolean;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface Project {
  id: string;
  user_id: string;
  project_name: string;
  display_name: string;
  description: string | null;
  instructions: string | null;
  is_active: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface Glossary {
  id: string;
  project_id: string;
  term: string;
  translations: Record<string, string>;
  context: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface Subscription {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  revenuecat_entitlement: string;
  monthly_request_limit: number;
  hourly_request_limit: number;
  requests_this_month: number;
  requests_this_hour: number;
  month_reset_at: Date | null;
  hour_reset_at: Date | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface UsageRecord {
  id: string;
  user_id: string;
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
}

export interface ProjectUpdateRequest {
  project_name: Optional<string>;
  display_name: Optional<string>;
  description: Optional<string>;
  instructions: Optional<string>;
  is_active: Optional<boolean>;
}

// Glossary requests
export interface GlossaryCreateRequest {
  term: string;
  translations: Record<string, string>;
  context: Optional<string>;
}

export interface GlossaryUpdateRequest {
  term: Optional<string>;
  translations: Optional<Record<string, string>>;
  context: Optional<string>;
}

// =============================================================================
// Query Parameter Types
// =============================================================================

export interface ProjectQueryParams {
  is_active: Optional<string>;
}

export interface GlossaryQueryParams {
  search: Optional<string>;
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
}

export interface TranslationResponse {
  translations: Record<string, string[]>;
  glossaries_used: string[];
  request_id: string;
}

// =============================================================================
// Glossary Callback Types (GET endpoint for translation service)
// =============================================================================

export interface GlossaryLookupRequest {
  glossary: string;
  languages: string;
}

export interface GlossaryLookupResponse {
  glossary: string;
  translations: Record<string, string | null>;
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
// Rate Limit Types
// =============================================================================

export interface RateLimitStatus {
  tier: SubscriptionTier;
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

export interface TranslationServicePayload {
  target_languages: string[];
  strings: string[];
  glossaries: string[];
  glossary_callback_url: string;
}

export interface TranslationServiceResponse {
  translations: Record<string, string[]>;
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
export type GlossaryListResponse = BaseResponse<Glossary[]>;

// Single entity responses
export type ProjectResponse = BaseResponse<Project>;
export type GlossaryResponse = BaseResponse<Glossary>;
export type UserSettingsResponse = BaseResponse<UserSettings>;
export type SubscriptionResponse = BaseResponse<Subscription>;
export type RateLimitResponse = BaseResponse<RateLimitStatus>;

// Analytics response
export type AnalyticsApiResponse = BaseResponse<AnalyticsResponse>;

// Translation responses
export type TranslationApiResponse = BaseResponse<TranslationResponse>;
export type GlossaryLookupApiResponse = BaseResponse<GlossaryLookupResponse>;

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
