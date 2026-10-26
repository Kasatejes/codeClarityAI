import React, { useState } from 'react';
import {
  AlertCircle,
  MapPin,
  Check,
  Copy,
  Lightbulb,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import type { AnalyzeResponse } from '../types';

interface DebugReportProps {
  report: AnalyzeResponse | null;
  isLoading: boolean;
  onViewConcept: () => void;
  onCopySuccess: () => void;
}

export const DebugReport: React.FC<DebugReportProps> = ({
  report,
  isLoading,
  onViewConcept,
  onCopySuccess,
}) => {
  const [copied, setCopied] = useState(false);
  const [revealedHintLevel, setRevealedHintLevel] = useState<number>(1); // 1 = gentle, 2 = detailed, 3 = solution

  if (isLoading) {
    return (
      <div className="card loading-box">
        <div className="spinner" />
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc' }}>
          Consulting Gemma 4 AI Tutor...
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#94a3b8', maxWidth: '320px' }}>
          Parsing syntax, analyzing logic boundaries, and formulating pedagogical hints.
        </p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="card empty-state">
        <Sparkles className="empty-icon" />
        <h3>Awaiting Code Input</h3>
        <p>
          Load a sample bug from the left panel or paste your C++ / Python code and click{' '}
          <strong>Analyze Code</strong> to receive a structured debugging breakdown.
        </p>
      </div>
    );
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(report.corrected_code);
      setCopied(true);
      onCopySuccess();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* 1. Problem Overview Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <AlertCircle size={20} className="card-icon" style={{ color: '#f43f5e' }} />
            <h2 className="card-title">Debugging Diagnosis</h2>
          </div>
          <span className="badge badge-rose">{report.error_category}</span>
        </div>

        <p style={{ fontSize: '0.92rem', color: '#f8fafc', fontWeight: 500, lineHeight: 1.6 }}>
          {report.summary}
        </p>

        {report.code_location && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginTop: '0.85rem',
              fontSize: '0.8rem',
              color: '#38bdf8',
            }}
          >
            <MapPin size={14} />
            <span>
              <strong>Identified Location:</strong> {report.code_location}
            </span>
          </div>
        )}

        {/* Beginner Explanation */}
        <div
          style={{
            marginTop: '1rem',
            padding: '0.85rem 1rem',
            background: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-md)',
            borderLeft: '3px solid var(--violet-primary)',
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#c4b5fd',
              marginBottom: '0.35rem',
            }}
          >
            Why This Happens (Beginner Explanation)
          </div>
          <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            {report.explanation}
          </p>
        </div>

        {/* Quick link to Concept */}
        {report.learning_concept && (
          <div style={{ marginTop: '0.85rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-secondary" onClick={onViewConcept}>
              <BookOpen size={14} />
              <span>Learn Concept: {report.learning_concept.concept_name}</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Progressive Hint System Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <Lightbulb size={20} className="card-icon" style={{ color: '#f59e0b' }} />
            <h2 className="card-title">Progressive Hint System</h2>
          </div>
          <span className="badge badge-amber">Step-by-Step Learning</span>
        </div>

        <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
          Don't spoil the solution right away! Try working through each hint level first to build your problem-solving intuition.
        </p>

        <div className="hints-container">
          {/* Level 1: Gentle Hint */}
          <div className="hint-step">
            <div className="hint-header">
              <span className="hint-level-badge" style={{ color: '#38bdf8' }}>
                Level 1: Gentle Nudge
              </span>
              <span className="badge badge-blue">Foundational</span>
            </div>
            <div className="hint-content">
              {report.hints.gentle || 'Check the range of your indices.'}
            </div>
          </div>

          {/* Level 2: Detailed Hint */}
          <div className={`hint-step ${revealedHintLevel < 2 ? 'locked' : ''}`}>
            <div className="hint-header">
              <span className="hint-level-badge" style={{ color: '#a78bfa' }}>
                Level 2: Mechanism & Concept
              </span>
              {revealedHintLevel < 2 ? (
                <button
                  className="btn-secondary"
                  onClick={() => setRevealedHintLevel(2)}
                >
                  <ChevronRight size={14} />
                  <span>Unlock Level 2</span>
                </button>
              ) : (
                <span className="badge badge-violet">Unlocked</span>
              )}
            </div>
            {revealedHintLevel >= 2 ? (
              <div className="hint-content">{report.hints.detailed}</div>
            ) : (
              <p style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                Contains deeper context regarding why the language raised this exception.
              </p>
            )}
          </div>

          {/* Level 3: Solution Explanation */}
          <div className={`hint-step ${revealedHintLevel < 3 ? 'locked' : ''}`}>
            <div className="hint-header">
              <span className="hint-level-badge" style={{ color: '#34d399' }}>
                Level 3: Full Solution Guidance
              </span>
              {revealedHintLevel < 3 ? (
                <button
                  className="btn-secondary"
                  onClick={() => setRevealedHintLevel(3)}
                >
                  <ChevronRight size={14} />
                  <span>Reveal Solution</span>
                </button>
              ) : (
                <span className="badge badge-emerald">Unlocked</span>
              )}
            </div>
            {revealedHintLevel >= 3 ? (
              <div className="hint-content">{report.hints.solution}</div>
            ) : (
              <p style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                Reveals the direct correction and why the syntax/logic changes resolve the issue.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 3. Corrected Code & Suggested Fix Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <Check size={20} className="card-icon" style={{ color: '#10b981' }} />
            <h2 className="card-title">Corrected Code & Why It Works</h2>
          </div>
          <button className="btn-secondary" onClick={handleCopyCode}>
            {copied ? (
              <>
                <Check size={14} color="#10b981" />
                <span style={{ color: '#10b981' }}>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        <div style={{ marginBottom: '0.75rem' }}>
          <strong style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>Suggested Fix:</strong>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.25rem', lineHeight: 1.5 }}>
            {report.suggested_fix}
          </p>
        </div>

        {/* Code Snippet Box */}
        <div className="code-box">
          <div className="code-box-header">
            <span>Verified Correction</span>
            <span>Gemma 4 Solution</span>
          </div>
          <pre>
            <code>{report.corrected_code}</code>
          </pre>
        </div>

        {/* Why the correction works */}
        <div
          style={{
            marginTop: '0.85rem',
            padding: '0.75rem 1rem',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.82rem',
            color: '#d1fae5',
            lineHeight: 1.6,
          }}
        >
          <strong>Why this works:</strong> {report.why_it_works}
        </div>
      </div>

      {/* 4. Suggested Test Cases Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <Check size={20} className="card-icon" />
            <h2 className="card-title">Suggested Test Cases</h2>
          </div>
          <span className="badge badge-blue">Verification</span>
        </div>

        <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
          Always verify your fix across normal inputs, edge cases, and unexpected parameters:
        </p>

        <div className="test-cases-grid">
          {report.test_cases.map((tc, idx) => (
            <div key={idx} className="test-case-card">
              <div className="test-case-title">
                <span className="badge badge-violet" style={{ fontSize: '0.7rem' }}>
                  Case #{idx + 1}
                </span>
                <span>{tc.description}</span>
              </div>
              <div className="test-case-row">
                <div className="test-case-param">
                  Input: <span>{tc.input}</span>
                </div>
                <div className="test-case-param">
                  Expected Output: <span style={{ color: '#10b981' }}>{tc.expected_output}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Model Transparency & Safety Footer Notice */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.65rem 1rem',
          background: 'var(--bg-elevated)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.74rem',
          color: '#64748b',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ShieldCheck size={14} color="#8b5cf6" />
          <span>
            Analyzed statically by <strong>{report.model_used}</strong> ({report.provider_used}).
            User code is never executed.
          </span>
        </div>
        <span style={{ color: '#94a3b8' }}>No warranty of 100% bug-free guarantees</span>
      </div>
    </div>
  );
};
