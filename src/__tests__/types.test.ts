import { describe, it, expect } from 'vitest';
import type {
  User,
  UserSettings,
  UsageRecord,
  Endpoint,
  UserCreateRequest,
  UserUpdateRequest,
  UserSettingsUpdateRequest,
  ProjectCreateRequest,
  ProjectUpdateRequest,
  EndpointCreateRequest,
  EndpointUpdateRequest,
  GlossaryCreateRequest,
  GlossaryUpdateRequest,
  ProjectQueryParams,
  GlossaryQueryParams,
  UsageAnalyticsQueryParams,
  GlossaryLookupRequest,
  UsageAggregate,
  UsageByProject,
  UsageByDate,
  AnalyticsResponse,
  RateLimitStatus,
  TranslationServicePayload,
  TranslationServiceResponse,
  HealthCheckData,
  HttpMethod,
} from '../index';

describe('Entity Types', () => {
  describe('User', () => {
    it('has correct shape with all fields', () => {
      const user: User = {
        firebase_uid: 'firebase-abc',
        email: 'test@example.com',
        display_name: 'Test User',
        created_at: new Date(),
        updated_at: new Date(),
      };

      expect(user.firebase_uid).toBe('firebase-abc');
      expect(user.email).toBe('test@example.com');
    });

    it('allows null for optional fields', () => {
      const user: User = {
        firebase_uid: 'firebase-abc',
        email: null,
        display_name: null,
        created_at: null,
        updated_at: null,
      };

      expect(user.email).toBeNull();
      expect(user.display_name).toBeNull();
    });
  });

  describe('UserSettings', () => {
    it('has correct shape', () => {
      const settings: UserSettings = {
        id: 'settings-123',
        firebase_uid: 'firebase-abc',
        organization_name: 'My Org',
        organization_path: 'my-org',
        is_default: false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      expect(settings.organization_path).toBe('my-org');
      expect(settings.is_default).toBe(false);
    });

    it('allows null for optional fields', () => {
      const settings: UserSettings = {
        id: null,
        firebase_uid: 'firebase-abc',
        organization_name: null,
        organization_path: 'default-path',
        is_default: true,
        created_at: null,
        updated_at: null,
      };

      expect(settings.id).toBeNull();
      expect(settings.organization_name).toBeNull();
    });
  });

  describe('UsageRecord', () => {
    it('has correct shape', () => {
      const record: UsageRecord = {
        uuid: 'usage-123',
        entity_id: 'entity-456',
        project_id: 'proj-789',
        endpoint_id: 'endpoint-abc',
        timestamp: new Date(),
        request_count: 5,
        string_count: 100,
        character_count: 2500,
        success: true,
        error_message: null,
      };

      expect(record.request_count).toBe(5);
      expect(record.success).toBe(true);
    });

    it('captures error information', () => {
      const record: UsageRecord = {
        uuid: 'usage-124',
        entity_id: 'entity-456',
        project_id: 'proj-789',
        endpoint_id: null,
        timestamp: new Date(),
        request_count: 1,
        string_count: 0,
        character_count: 0,
        success: false,
        error_message: 'Rate limit exceeded',
      };

      expect(record.success).toBe(false);
      expect(record.error_message).toBe('Rate limit exceeded');
    });
  });

  describe('Endpoint', () => {
    it('has correct shape', () => {
      const endpoint: Endpoint = {
        id: 'endpoint-123',
        project_id: 'proj-456',
        endpoint_name: 'translate',
        display_name: 'Translation Endpoint',
        http_method: 'POST',
        instructions: 'Translate formally',
        default_source_language: 'en',
        default_target_languages: ['ja', 'es'],
        is_active: true,
        ip_allowlist: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      expect(endpoint.endpoint_name).toBe('translate');
      expect(endpoint.http_method).toBe('POST');
    });
  });
});

describe('Request Types', () => {
  describe('UserCreateRequest', () => {
    it('has correct shape', () => {
      const request: UserCreateRequest = {
        firebase_uid: 'firebase-abc',
        email: 'test@example.com',
        display_name: 'Test User',
      };

      expect(request.firebase_uid).toBe('firebase-abc');
    });

    it('allows undefined for optional fields', () => {
      const request: UserCreateRequest = {
        firebase_uid: 'firebase-abc',
        email: undefined,
        display_name: undefined,
      };

      expect(request.email).toBeUndefined();
    });
  });

  describe('UserUpdateRequest', () => {
    it('has correct shape', () => {
      const request: UserUpdateRequest = {
        email: 'new@example.com',
        display_name: 'New Name',
      };

      expect(request.email).toBe('new@example.com');
    });
  });

  describe('UserSettingsUpdateRequest', () => {
    it('has correct shape', () => {
      const request: UserSettingsUpdateRequest = {
        organization_name: 'New Org',
        organization_path: 'new-org',
      };

      expect(request.organization_path).toBe('new-org');
    });
  });

  describe('ProjectCreateRequest', () => {
    it('has correct shape with required and optional fields', () => {
      const request: ProjectCreateRequest = {
        project_name: 'my-project',
        display_name: 'My Project',
        description: 'A test project',
        instructions: 'Translate formally',
      };

      expect(request.project_name).toBe('my-project');
      expect(request.display_name).toBe('My Project');
    });
  });

  describe('ProjectUpdateRequest', () => {
    it('allows partial updates', () => {
      const request: ProjectUpdateRequest = {
        display_name: 'Updated Name',
        project_name: undefined,
        description: undefined,
        instructions: undefined,
        is_active: true,
      };

      expect(request.display_name).toBe('Updated Name');
      expect(request.is_active).toBe(true);
    });
  });

  describe('EndpointCreateRequest', () => {
    it('has correct shape', () => {
      const request: EndpointCreateRequest = {
        endpoint_name: 'translate',
        display_name: 'Translation Endpoint',
        http_method: 'POST',
        instructions: 'Translate formally',
        default_source_language: 'en',
        default_target_languages: ['ja', 'es'],
        ip_allowlist: undefined,
      };

      expect(request.endpoint_name).toBe('translate');
    });
  });

  describe('EndpointUpdateRequest', () => {
    it('allows partial updates', () => {
      const request: EndpointUpdateRequest = {
        display_name: 'Updated Endpoint',
        endpoint_name: undefined,
        http_method: undefined,
        instructions: 'New instructions',
        default_source_language: undefined,
        default_target_languages: undefined,
        is_active: true,
        ip_allowlist: undefined,
      };

      expect(request.display_name).toBe('Updated Endpoint');
    });
  });

  describe('GlossaryCreateRequest', () => {
    it('has correct shape', () => {
      const request: GlossaryCreateRequest = {
        term: 'hello',
        translations: { ja: 'こんにちは', es: 'hola' },
        context: 'greeting',
      };

      expect(request.term).toBe('hello');
      expect(request.translations['ja']).toBe('こんにちは');
    });
  });

  describe('GlossaryUpdateRequest', () => {
    it('allows partial updates', () => {
      const request: GlossaryUpdateRequest = {
        term: undefined,
        translations: { ja: '今日は' },
        context: undefined,
      };

      expect(request.translations).toEqual({ ja: '今日は' });
    });
  });
});

describe('Query Parameter Types', () => {
  describe('ProjectQueryParams', () => {
    it('has correct shape', () => {
      const params: ProjectQueryParams = {
        is_active: 'true',
      };

      expect(params.is_active).toBe('true');
    });
  });

  describe('GlossaryQueryParams', () => {
    it('has correct shape', () => {
      const params: GlossaryQueryParams = {
        search: 'hello',
      };

      expect(params.search).toBe('hello');
    });
  });

  describe('UsageAnalyticsQueryParams', () => {
    it('has correct shape', () => {
      const params: UsageAnalyticsQueryParams = {
        project_id: 'proj-123',
        start_date: '2024-01-01',
        end_date: '2024-01-31',
        success: 'true',
      };

      expect(params.project_id).toBe('proj-123');
      expect(params.start_date).toBe('2024-01-01');
    });
  });
});

describe('Glossary Callback Types', () => {
  describe('GlossaryLookupRequest', () => {
    it('has correct shape', () => {
      const request: GlossaryLookupRequest = {
        glossary: 'hello',
        languages: 'ja,es,fr',
      };

      expect(request.glossary).toBe('hello');
      expect(request.languages).toBe('ja,es,fr');
    });
  });
});

describe('Analytics Types', () => {
  describe('UsageAggregate', () => {
    it('has correct shape', () => {
      const aggregate: UsageAggregate = {
        total_requests: 1000,
        total_strings: 50000,
        total_characters: 250000,
        successful_requests: 950,
        failed_requests: 50,
        success_rate: 0.95,
        period_start: '2024-01-01',
        period_end: '2024-01-31',
      };

      expect(aggregate.total_requests).toBe(1000);
      expect(aggregate.success_rate).toBe(0.95);
    });
  });

  describe('UsageByProject', () => {
    it('has correct shape', () => {
      const usage: UsageByProject = {
        project_id: 'proj-123',
        project_name: 'my-project',
        request_count: 500,
        string_count: 25000,
        character_count: 125000,
        success_rate: 0.98,
      };

      expect(usage.project_name).toBe('my-project');
      expect(usage.request_count).toBe(500);
    });
  });

  describe('UsageByDate', () => {
    it('has correct shape', () => {
      const usage: UsageByDate = {
        date: '2024-01-15',
        request_count: 50,
        string_count: 2500,
        character_count: 12500,
      };

      expect(usage.date).toBe('2024-01-15');
    });
  });

  describe('AnalyticsResponse', () => {
    it('has correct shape', () => {
      const response: AnalyticsResponse = {
        aggregate: {
          total_requests: 100,
          total_strings: 5000,
          total_characters: 25000,
          successful_requests: 95,
          failed_requests: 5,
          success_rate: 0.95,
          period_start: '2024-01-01',
          period_end: '2024-01-31',
        },
        by_project: [
          {
            project_id: 'proj-1',
            project_name: 'project-1',
            request_count: 50,
            string_count: 2500,
            character_count: 12500,
            success_rate: 0.96,
          },
        ],
        by_date: [
          {
            date: '2024-01-01',
            request_count: 10,
            string_count: 500,
            character_count: 2500,
          },
        ],
      };

      expect(response.aggregate.total_requests).toBe(100);
      expect(response.by_project).toHaveLength(1);
      expect(response.by_date).toHaveLength(1);
    });
  });
});

describe('Rate Limit Types', () => {
  describe('RateLimitStatus', () => {
    it('has correct shape', () => {
      const status: RateLimitStatus = {
        tier: 'pro',
        monthly_limit: 50000,
        monthly_used: 10000,
        monthly_remaining: 40000,
        hourly_limit: 2000,
        hourly_used: 100,
        hourly_remaining: 1900,
        resets_at: {
          monthly: '2024-02-01T00:00:00Z',
          hourly: '2024-01-15T15:00:00Z',
        },
      };

      expect(status.tier).toBe('pro');
      expect(status.monthly_remaining).toBe(40000);
    });
  });
});

describe('Translation Service Types', () => {
  describe('TranslationServicePayload', () => {
    it('has correct shape', () => {
      const payload: TranslationServicePayload = {
        target_languages: ['ja', 'es'],
        strings: ['Hello', 'World'],
        glossaries: ['greeting', 'common'],
        glossary_callback_url: 'https://api.example.com/glossary',
      };

      expect(payload.target_languages).toContain('ja');
      expect(payload.glossary_callback_url).toContain('glossary');
    });
  });

  describe('TranslationServiceResponse', () => {
    it('has correct shape', () => {
      const response: TranslationServiceResponse = {
        translations: {
          ja: ['こんにちは', '世界'],
          es: ['Hola', 'Mundo'],
        },
      };

      expect(response.translations['ja']).toHaveLength(2);
    });
  });
});

describe('Health Check Types', () => {
  describe('HealthCheckData', () => {
    it('has correct shape', () => {
      const data: HealthCheckData = {
        name: 'whisperly-api',
        version: '1.0.0',
        status: 'healthy',
      };

      expect(data.name).toBe('whisperly-api');
      expect(data.status).toBe('healthy');
    });
  });
});

describe('Enum Types', () => {
  describe('HttpMethod', () => {
    it('accepts valid methods', () => {
      const getMethods: HttpMethod[] = ['GET', 'POST'];
      expect(getMethods).toContain('GET');
      expect(getMethods).toContain('POST');
    });
  });
});
