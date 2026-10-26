import React from 'react';
import { BookOpen, Sparkles, Lightbulb, ArrowLeft } from 'lucide-react';
import type { LearningConcept } from '../types';

interface LearnViewProps {
  currentConcept: LearningConcept | null;
  onBackToDebugger: () => void;
}

const DEFAULT_CONCEPTS: LearningConcept[] = [
  {
    concept_name: 'Zero-Based Indexing & Memory Offsets',
    explanation:
      'In Python, C++, and many modern languages, collections (lists, arrays, vectors) start numbering at 0 instead of 1. The index represents the offset from the beginning of the memory block. As a result, an array of N items has valid indices from 0 to N-1.',
    quick_example: `// C++ / Python Example:
int arr[5] = {10, 20, 30, 40, 50};
// arr[0] is 10, arr[4] is 50.
// Accessing arr[5] triggers an out-of-bounds error!`,
  },
  {
    concept_name: 'Pointer Nullability & Memory Safety',
    explanation:
      'A pointer in C++ holds the memory address of an object. If a pointer points to nullptr (or uninitialized memory), attempting to access its members using \`ptr->value\` or \`*ptr\` triggers undefined behavior, commonly terminating your program with a Segmentation Fault (SIGSEGV).',
    quick_example: `Node* current = get_head();
// Always verify pointer before dereferencing:
if (current != nullptr) {
    std::cout << current->value;
}`,
  },
  {
    concept_name: 'Type Mismatch in Dynamic vs Static Expressions',
    explanation:
      'Languages enforce type rules to prevent operations on incompatible data formats. In Python, trying to combine a string and integer with \`+\` fails because \`+\` has conflicting meanings (concatenation vs arithmetic addition).',
    quick_example: `# Incorrect:
# message = "Score: " + 100

# Correct:
message = f"Score: {100}"
# or message = "Score: " + str(100)`,
  },
  {
    concept_name: 'Mutable Default Arguments in Python Functions',
    explanation:
      'In Python, default parameter values are evaluated once when the function is defined, not each time it is called. If you use a mutable object (like a list or dict) as a default, every call shares the exact same instance.',
    quick_example: `# Recommended pattern:
def append_to_list(item, target_list=None):
    if target_list is None:
        target_list = []
    target_list.append(item)
    return target_list`,
  },
];

export const LearnView: React.FC<LearnViewProps> = ({ currentConcept, onBackToDebugger }) => {
  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={24} color="#8b5cf6" />
            <span>Learning Mode: Programming Concepts</span>
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            Master the foundational principles behind common runtime crashes and syntax errors.
          </p>
        </div>
        <button className="btn-secondary" onClick={onBackToDebugger}>
          <ArrowLeft size={15} />
          <span>Back to Debugger</span>
        </button>
      </div>

      {/* Active Concept from Analysis */}
      {currentConcept && (
        <div className="card" style={{ border: '1px solid #8b5cf6', background: 'rgba(139, 92, 246, 0.05)' }}>
          <div className="card-header">
            <div className="card-title-group">
              <Sparkles size={18} color="#8b5cf6" />
              <h3 className="card-title" style={{ color: '#c4b5fd' }}>
                Active Concept: {currentConcept.concept_name}
              </h3>
            </div>
            <span className="badge badge-violet">From Your Current Code</span>
          </div>

          <p style={{ fontSize: '0.92rem', color: '#e2e8f0', lineHeight: 1.6, marginBottom: '1rem' }}>
            {currentConcept.explanation}
          </p>

          <div className="code-box">
            <div className="code-box-header">
              <span>Minimal Correct Pattern</span>
              <span>Gemma 4 Example</span>
            </div>
            <pre>
              <code>{currentConcept.quick_example}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Concept Library */}
      <div style={{ marginTop: '0.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '1rem' }}>
          Foundational Computer Science Concepts
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.25rem' }}>
          {DEFAULT_CONCEPTS.map((concept, idx) => (
            <div key={idx} className="card">
              <div className="card-header">
                <div className="card-title-group">
                  <Lightbulb size={18} color="#f59e0b" />
                  <h4 className="card-title">{concept.concept_name}</h4>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '0.85rem' }}>
                {concept.explanation}
              </p>

              <div className="code-box">
                <div className="code-box-header">
                  <span>Reference Snippet</span>
                </div>
                <pre style={{ fontSize: '0.78rem' }}>
                  <code>{concept.quick_example}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
