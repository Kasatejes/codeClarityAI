import type { AnalyzeResponse, HealthResponse, HintResponse } from './types';

const API_BASE = '/api';

export async function getHealth(): Promise<HealthResponse> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) {
      throw new Error(`Health check failed with status: ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    return {
      status: 'offline',
      provider: 'unknown',
      model: 'gemma-4-26b-a4b-it',
      api_key_configured: false,
      ollama_url: 'http://127.0.0.1:11434',
      ollama_model: 'gemma4',
      supported_languages: ['python', 'cpp'],
    };
  }
}

export async function analyzeCode(
  code: string,
  language: string,
  errorMessage: string,
  imageFile?: File | null
): Promise<AnalyzeResponse> {
  const formData = new FormData();
  formData.append('code', code);
  formData.append('language', language);
  formData.append('error_message', errorMessage);

  if (imageFile) {
    formData.append('image', imageFile);
  }

  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    let errDetail = 'Analysis request failed.';
    try {
      const errJson = await res.json();
      if (errJson && errJson.detail) {
        errDetail = errJson.detail;
      }
    } catch {
      errDetail = `HTTP ${res.status}: ${res.statusText}`;
    }
    throw new Error(errDetail);
  }

  return await res.json();
}

export async function requestHint(
  level: 'gentle' | 'detailed' | 'solution',
  code: string,
  language: string,
  errorMessage: string,
  context?: string
): Promise<HintResponse> {
  const res = await fetch(`${API_BASE}/hint`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      level,
      code,
      language,
      error_message: errorMessage,
      context,
    }),
  });

  if (!res.ok) {
    let errDetail = 'Failed to fetch hint.';
    try {
      const errJson = await res.json();
      if (errJson?.detail) errDetail = errJson.detail;
    } catch {
      errDetail = `HTTP ${res.status}`;
    }
    throw new Error(errDetail);
  }

  return await res.json();
}
