import { describe, it, expect } from 'vitest';
import {
  successResponse,
  errorResponse,
  type Project,
  type Dictionary,
  type DictionaryEntry,
  type DictionaryTranslations,
  type TranslationRequest,
  type TranslationResponse,
  type DictionaryLookupResponse,
  type RateLimitTier,
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

    it('creates a success response with an array', () => {
      const data = [
        { id: '1', name: 'first' },
        { id: '2', name: 'second' },
      ];
      const response = successResponse(data);

      expect(response.success).toBe(true);
      expect(response.data).toHaveLength(2);
      expect(response.data).toEqual(data);
    });

    it('creates a success response with nested objects', () => {
      const data = {
        user: { id: '1', profile: { bio: 'hello', tags: ['a', 'b'] } },
      };
      const response = successResponse(data);

      expect(response.success).toBe(true);
      expect(response.data?.user.profile.tags).toHaveLength(2);
    });

    it('creates a success response with null data', () => {
      const response = successResponse(null);

      expect(response.success).toBe(true);
      expect(response.data).toBeNull();
      expect(response.timestamp).toBeDefined();
    });

    it('creates a success response with an empty array', () => {
      const response = successResponse([]);

      expect(response.success).toBe(true);
      expect(response.data).toEqual([]);
    });

    it('creates a success response with a string', () => {
      const response = successResponse('simple value');

      expect(response.success).toBe(true);
      expect(response.data).toBe('simple value');
    });

    it('creates a success response with a number', () => {
      const response = successResponse(42);

      expect(response.success).toBe(true);
      expect(response.data).toBe(42);
    });
  });

  describe('errorResponse', () => {
    it('creates an error response with message', () => {
      const response = errorResponse('Something went wrong');

      expect(response.success).toBe(false);
      expect(response.error).toBe('Something went wrong');
      expect(response.timestamp).toBeDefined();
    });

    it('creates an error response with empty message', () => {
      const response = errorResponse('');

      expect(response.success).toBe(false);
      expect(response.error).toBe('');
      expect(response.timestamp).toBeDefined();
    });
  });

  describe('type definitions', () => {
    it('Project type has correct shape', () => {
      const project: Project = {
        id: '123',
        entity_id: '456',
        project_name: 'my-project',
        display_name: 'My Project',
        description: 'A test project',
        instructions: 'Translate formally',
        default_source_language: 'en',
        default_target_languages: ['ja', 'es'],
        ip_allowlist: null,
        api_key: null,
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
        text: '\u3053\u3093\u306b\u3061\u306f',
        created_at: new Date(),
        updated_at: new Date(),
      };

      expect(entry.language_code).toBe('ja');
      expect(entry.text).toBe('\u3053\u3093\u306b\u3061\u306f');
    });

    it('DictionaryTranslations type has correct shape', () => {
      const translations: DictionaryTranslations = {
        ja: '\u3053\u3093\u306b\u3061\u306f',
        es: 'hola',
      };

      expect(translations['ja']).toBe('\u3053\u3093\u306b\u3061\u306f');
      expect(translations['es']).toBe('hola');
    });

    it('DictionaryTranslations with empty object', () => {
      const translations: DictionaryTranslations = {};

      expect(Object.keys(translations)).toHaveLength(0);
    });

    it('RateLimitTier union type is correct', () => {
      const tiers: RateLimitTier[] = [
        'free',
        'starter',
        'pro',
        'enterprise',
      ];
      expect(tiers).toContain('free');
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
          ja: ['\u3053\u3093\u306b\u3061\u306f', '\u4e16\u754c'],
          es: ['Hola', 'Mundo'],
        },
        dictionary_terms_used: ['greeting'],
        request_id: 'req-123',
      };

      expect(response.translations['ja']).toHaveLength(2);
      expect(response.dictionary_terms_used).toContain('greeting');
    });

    it('DictionaryLookupResponse type has correct shape', () => {
      const response: DictionaryLookupResponse = {
        term: 'hello',
        translations: {
          ja: '\u3053\u3093\u306b\u3061\u306f',
          es: 'hola',
          fr: null, // Not found
        },
      };

      expect(response.term).toBe('hello');
      expect(response.translations['ja']).toBe('\u3053\u3093\u306b\u3061\u306f');
      expect(response.translations['fr']).toBeNull();
    });
  });
});
