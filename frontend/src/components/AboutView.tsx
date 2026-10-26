import React from 'react';
import { Info, Shield, Cpu, ArrowLeft, ExternalLink, Sparkles } from 'lucide-react';

interface AboutViewProps {
  onBackToDebugger: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onBackToDebugger }) => {
  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={24} color="#8b5cf6" />
            <span>About CodeClarity AI</span>
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            Project 1 — Hacktoberfest Challenge: Gemma 4-Powered AI Coding Tutor
          </p>
        </div>
        <button className="btn-secondary" onClick={onBackToDebugger}>
          <ArrowLeft size={15} />
          <span>Back to Debugger</span>
        </button>
      </div>

      {/* Vision Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <Sparkles size={18} color="#8b5cf6" />
            <h3 className="card-title">Product Vision</h3>
          </div>
          <span className="badge badge-violet">Pedagogy First</span>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.7 }}>
          CodeClarity AI is designed specifically for beginner and intermediate programmers learning <strong>C++</strong> and <strong>Python</strong>.
          Instead of encouraging users to blindly copy and paste AI-generated answers, CodeClarity AI acts as an empathetic mentor: it identifies the root cause of an error, presents progressive hints (from gentle nudges to detailed mechanisms and full corrections), clarifies underlying computer science concepts, and suggests three verified test cases.
        </p>
      </div>

      {/* Gemma 4 Role & Model Architecture */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <Cpu size={18} color="#38bdf8" />
            <h3 className="card-title">Gemma 4 AI Engine</h3>
          </div>
          <span className="badge badge-blue">Official Google Model</span>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.7, marginBottom: '1rem' }}>
          CodeClarity AI is powered by Google's <strong>Gemma 4</strong> open-weights family:
        </p>
        <ul style={{ paddingLeft: '1.25rem', color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.8 }}>
          <li>
            <strong style={{ color: '#f8fafc' }}>Cloud Model:</strong> Uses <code style={{ color: '#38bdf8' }}>gemma-4-26b-a4b-it</code> through the official Google Gen AI Python SDK (<code style={{ color: '#c4b5fd' }}>google-genai</code>).
          </li>
          <li>
            <strong style={{ color: '#f8fafc' }}>Local Mode:</strong> Supports local Ollama instances running <code style={{ color: '#38bdf8' }}>gemma4</code> at <code style={{ color: '#c4b5fd' }}>http://127.0.0.1:11434</code>.
          </li>
          <li>
            <strong style={{ color: '#f8fafc' }}>Multimodal Vision:</strong> Enables screenshot analysis of compiler terminal logs and IDE errors directly into Gemma 4.
          </li>
          <li>
            <strong style={{ color: '#f8fafc' }}>Thinking & Reasoning:</strong> Leverages internal thinking mechanisms for rigorous static analysis of pointer semantics, boundary conditions, and algorithmic loops.
          </li>
        </ul>
      </div>

      {/* Safety & Limitations */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <Shield size={18} color="#10b981" />
            <h3 className="card-title">Safety & Limitations</h3>
          </div>
          <span className="badge badge-emerald">Static Analysis Only</span>
        </div>
        <ul style={{ paddingLeft: '1.25rem', color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.8 }}>
          <li>
            <strong>No Untrusted Code Execution:</strong> CodeClarity AI performs 100% static analysis. User-submitted code and error logs are never executed on the host server or in sandboxes in this MVP.
          </li>
          <li>
            <strong>API Key Security:</strong> Your Gemini API key remains exclusively on the backend in the local <code style={{ color: '#c4b5fd' }}>.env</code> file. It is never transmitted to the browser, logged, or exposed in repository commits.
          </li>
          <li>
            <strong>No Bug-Free Guarantees:</strong> Like all language models, Gemma 4 is a diagnostic and pedagogical assistant; it does not claim to guarantee mathematically bug-free code.
          </li>
        </ul>
      </div>

      {/* Setup Guide Link */}
      <div className="card" style={{ background: 'var(--bg-elevated)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
              Want to configure your own Gemini API Key?
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              Get a free Gemini API key from Google AI Studio and place it in your local <code>.env</code> file.
            </p>
          </div>
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ textDecoration: 'none' }}
          >
            <span>Get Gemini API Key</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};
