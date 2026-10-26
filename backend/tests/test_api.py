import pytest
from fastapi.testclient import TestClient
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.main import app

client = TestClient(app)


def test_health_endpoint():
    """Verify health endpoint reports status without leaking secrets."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "gemma" in data["model"].lower()
    assert "supported_languages" in data
    assert "python" in data["supported_languages"]
    assert "cpp" in data["supported_languages"]
    # Check that secrets are not returned
    assert "GEMINI_API_KEY" not in str(data)


def test_analyze_empty_input_validation():
    """Submitting empty code without image should return 400 Bad Request."""
    response = client.post(
        "/api/analyze",
        json={"code": "", "language": "python", "error_message": ""}
    )
    assert response.status_code == 400
    assert "provide code to analyze or upload a screenshot" in response.json()["detail"].lower()


def test_analyze_unsupported_file():
    """Uploading an unsupported file format like .txt or .exe should return 400."""
    files = {
        "image": ("test.txt", b"plain text file", "text/plain")
    }
    data = {
        "code": "print('hello')",
        "language": "python",
    }
    response = client.post("/api/analyze", data=data, files=files)
    assert response.status_code == 400
    assert "unsupported image format" in response.json()["detail"].lower()


def test_analyze_python_code():
    """Verify structured response for Python code."""
    payload = {
        "code": "numbers = [1, 2, 3]\nfor i in range(4):\n    print(numbers[i])",
        "language": "python",
        "error_message": "IndexError: list index out of range",
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    # Check all required structured fields
    assert "summary" in data and len(data["summary"]) > 0
    assert "error_category" in data and len(data["error_category"]) > 0
    assert "explanation" in data and len(data["explanation"]) > 0
    assert "suggested_fix" in data and len(data["suggested_fix"]) > 0
    assert "corrected_code" in data and len(data["corrected_code"]) > 0
    assert "why_it_works" in data and len(data["why_it_works"]) > 0
    assert "test_cases" in data and len(data["test_cases"]) >= 1
    assert "learning_concept" in data
    assert "concept_name" in data["learning_concept"]
    assert "hints" in data
    assert "gentle" in data["hints"]
    assert "detailed" in data["hints"]
    assert "solution" in data["hints"]


def test_analyze_cpp_code():
    """Verify structured response for C++ code."""
    payload = {
        "code": "#include <iostream>\nint main() {\n    int* ptr = nullptr;\n    std::cout << *ptr;\n    return 0;\n}",
        "language": "cpp",
        "error_message": "Segmentation fault (core dumped)",
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert "hints" in data
    assert "learning_concept" in data


def test_progressive_hints_endpoint():
    """Verify progressive hint requests return appropriate levels."""
    base_payload = {
        "code": "def add(a, b):\nreturn a + b",
        "language": "python",
        "error_message": "IndentationError: expected an indented block",
    }

    # Level 1: gentle
    res1 = client.post("/api/hint", json={**base_payload, "level": "gentle"})
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["level"] == "gentle"
    assert len(data1["hint"]) > 0

    # Level 2: detailed
    res2 = client.post("/api/hint", json={**base_payload, "level": "detailed"})
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["level"] == "detailed"

    # Level 3: solution
    res3 = client.post("/api/hint", json={**base_payload, "level": "solution"})
    assert res3.status_code == 200
    data3 = res3.json()
    assert data3["level"] == "solution"


def test_hint_empty_code_validation():
    """Empty code should be rejected with 400 on hint endpoint."""
    response = client.post("/api/hint", json={"code": "", "language": "python", "level": "gentle"})
    assert response.status_code == 400
