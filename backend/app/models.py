from typing import Optional, List
from pydantic import BaseModel, Field


class TestCase(BaseModel):
    description: str = Field(..., description="Short explanation of what this test case tests")
    input: str = Field(..., description="Sample inputs or invocation")
    expected_output: str = Field(..., description="Expected output or return value")


class LearningConcept(BaseModel):
    concept_name: str = Field(..., description="Name of the underlying programming concept")
    explanation: str = Field(..., description="Beginner-friendly explanation of the concept")
    quick_example: str = Field(..., description="Short minimal code example showing correct usage")


class ProgressiveHints(BaseModel):
    gentle: str = Field(..., description="Gentle nudge without giving away the fix")
    detailed: str = Field(..., description="Deeper explanation of the cause and mechanism")
    solution: str = Field(..., description="Direct correction explanation")


class AnalyzeResponse(BaseModel):
    summary: str = Field(..., description="1-2 sentence overview of the bug")
    error_category: str = Field(..., description="Category like SyntaxError, IndexError, TypeMismatch, etc.")
    explanation: str = Field(..., description="Simple, approachable explanation for beginners")
    code_location: str = Field(..., description="Line number, function, or region of code affected")
    suggested_fix: str = Field(..., description="Step-by-step description of what to modify")
    corrected_code: str = Field(..., description="Full working corrected code snippet")
    why_it_works: str = Field(..., description="Why this fix works and resolves the problem")
    test_cases: List[TestCase] = Field(default_factory=list, description="3 suggested test cases with expected outcomes")
    learning_concept: LearningConcept = Field(..., description="Core computer science concept involved")
    hints: ProgressiveHints = Field(..., description="Progressive hints from gentle to full solution")
    model_used: str = Field(default="gemma-4-26b-a4b-it")
    provider_used: str = Field(default="google")
    extracted_code: Optional[str] = Field(default=None, description="Code extracted from screenshot if applicable")
    extracted_error: Optional[str] = Field(default=None, description="Error message extracted from screenshot if applicable")


class AnalyzeRequestJson(BaseModel):
    code: Optional[str] = Field(default="", description="Source code in C++ or Python")
    language: str = Field(default="python", description="'python' or 'cpp'")
    error_message: Optional[str] = Field(default="", description="Error output or user description of problem")


class HintRequest(BaseModel):
    level: str = Field(default="gentle", description="'gentle', 'detailed', or 'solution'")
    code: str = Field(..., description="Source code")
    language: str = Field(default="python", description="'python' or 'cpp'")
    error_message: Optional[str] = Field(default="", description="Error message or problem context")
    context: Optional[str] = Field(default=None, description="Prior analysis context")


class HintResponse(BaseModel):
    level: str
    hint: str
    model_used: str


class HealthResponse(BaseModel):
    status: str
    provider: str
    model: str
    api_key_configured: bool
    ollama_url: str
    ollama_model: str
    supported_languages: List[str]
