import { describe, it, expect } from 'vitest';
import {
  successResponse,
  errorResponse,
  type Project,
  type Dictionary,
  type DictionaryEntry,
  type DictionaryTranslations,
  type Subscription,
  type TranslationRequest,
  type TranslationResponse,
  type DictionaryLookupResponse,
  type SubscriptionTier,
} from '../index';

describe('whisperly_types', () => {
  describe('successResponse', () => {
    it('creates a success response with data', () => {
      const data = { id: '123', name: 'test' };
      const response = successResponse(data);

      expect(response.success).toBe(true);
      expect(response.data).toEqual(data);
      expect(response.timestamp).toBeDefined();
      expect(typeof response.timestamp).toBe('string');
    });
  });

  describe('errorResponse', () => {
    it('creates an error response with message', () => {
      const response = errorResponse('Something went wrong');

      expect(response.success).toBe(false);
      expect(response.error).toBe('Something went wrong');
      expect(response.timestamp).toBeDefined();
    });
  });

  describe('type definitions', () => {
    it('Project type has correct shape', () => {
      const project: Project = {
        id: '123',
        user_id: '456',
        project_name: 'my-project',
        display_name: 'My Project',
        description: 'A test project',
        instructions: 'Translate formally',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      expect(project.id).toBe('123');
      expect(project.project_name).toBe('my-project');
    });

    it('Dictionary type has correct shape', () => {
      const dictionary: Dictionary = {
        id: '123',
        entity_id: '456',
        project_id: '789',
        created_at: new Date(),
        updated_at: new Date(),
      };

      expect(dictionary.id).toBe('123');
      expect(dictionary.project_id).toBe('789');
    });

    it('DictionaryEntry type has correct shape', () => {
      const entry: DictionaryEntry = {
        id: '123',
        dictionary_id: '456',
        language_code: 'ja',
        text: 'こんにちは',
        created_at: new Date(),
        updated_at: new Date(),
      };

      expect(entry.language_code).toBe('ja');
      expect(entry.text).toBe('こんにちは');
    });

    it('DictionaryTranslations type has correct shape', () => {
      const translations: DictionaryTranslations = {
        ja: 'こんにちは',
        es: 'hola',
      };

      expect(translations['ja']).toBe('こんにちは');
      expect(translations['es']).toBe('hola');
    });

    it('Subscription type has correct shape', () => {
      const subscription: Subscription = {
        id: '123',
        user_id: '456',
        tier: 'pro',
        revenuecat_entitlement: 'pro_monthly',
        monthly_request_limit: 50000,
        hourly_request_limit: 2000,
        requests_this_month: 1000,
        requests_this_hour: 50,
        month_reset_at: new Date(),
        hour_reset_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      expect(subscription.tier).toBe('pro');
      expect(subscription.monthly_request_limit).toBe(50000);
    });

    it('SubscriptionTier union type is correct', () => {
      const tiers: SubscriptionTier[] = ['starter', 'pro', 'enterprise'];
      expect(tiers).toContain('starter');
      expect(tiers).toContain('pro');
      expect(tiers).toContain('enterprise');
    });

    it('TranslationRequest type has correct shape', () => {
      const request: TranslationRequest = {
        strings: ['Hello', 'World'],
        target_languages: ['ja', 'es'],
        source_language: 'en',
      };

      expect(request.strings).toHaveLength(2);
      expect(request.target_languages).toContain('ja');
    });

    it('TranslationResponse type has correct shape', () => {
      const response: TranslationResponse = {
        translations: {
          ja: ['こんにちは', '世界'],
          es: ['Hola', 'Mundo'],
        },
        glossaries_used: ['greeting'],
        request_id: 'req-123',
      };

      expect(response.translations['ja']).toHaveLength(2);
      expect(response.glossaries_used).toContain('greeting');
    });

    it('DictionaryLookupResponse type has correct shape', () => {
      const response: DictionaryLookupResponse = {
        term: 'hello',
        translations: {
          ja: 'こんにちは',
          es: 'hola',
          fr: null, // Not found
        },
      };

      expect(response.term).toBe('hello');
      expect(response.translations['ja']).toBe('こんにちは');
      expect(response.translations['fr']).toBeNull();
    });
  });
});
