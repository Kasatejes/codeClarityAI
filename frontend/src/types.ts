export interface TestCase {
  description: string;
  input: string;
  expected_output: string;
}

export interface LearningConcept {
  concept_name: string;
  explanation: string;
  quick_example: string;
}

export interface ProgressiveHints {
  gentle: string;
  detailed: string;
  solution: string;
}

export interface AnalyzeResponse {
  summary: string;
  error_category: string;
  explanation: string;
  code_location: string;
  suggested_fix: string;
  corrected_code: string;
  why_it_works: string;
  test_cases: TestCase[];
  learning_concept: LearningConcept;
  hints: ProgressiveHints;
  model_used: string;
  provider_used: string;
  extracted_code?: string;
  extracted_error?: string;
}

export interface HealthResponse {
  status: string;
  provider: string;
  model: string;
  api_key_configured: boolean;
  ollama_url: string;
  ollama_model: string;
  supported_languages: string[];
}

export interface HintResponse {
  level: string;
  hint: string;
  model_used: string;
}

export interface SampleSnippet {
  id: string;
  title: string;
  language: 'python' | 'cpp';
  category: string;
  code: string;
  errorMessage: string;
}
