import React from 'react';
import { Terminal, BookOpen, Info, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import type { HealthResponse } from '../types';

interface SidebarProps {
  currentTab: 'debugger' | 'learn' | 'about';
  setCurrentTab: (tab: 'debugger' | 'learn' | 'about') => void;
  health: HealthResponse | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, health }) => {
  const isHealthy = health?.status === 'healthy';

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="brand">
        <div className="brand-icon">
          <Sparkles size={20} />
        </div>
        <div className="brand-info">
          <h1>
            CodeClarity
            <span className="brand-tag">Gemma 4</span>
          </h1>
          <p className="brand-sub">AI Coding Tutor & Debugger</p>
        </div>
      </div>

      {/* Navigation */}
      <ul className="nav-links">
        <li>
          <button
            className={`nav-item ${currentTab === 'debugger' ? 'active' : ''}`}
            onClick={() => setCurrentTab('debugger')}
          >
            <Terminal size={18} />
            <span>Debugger</span>
            <span className="nav-badge">Core</span>
          </button>
        </li>
        <li>
          <button
            className={`nav-item ${currentTab === 'learn' ? 'active' : ''}`}
            onClick={() => setCurrentTab('learn')}
          >
            <BookOpen size={18} />
            <span>Learn Concepts</span>
          </button>
        </li>
        <li>
          <button
            className={`nav-item ${currentTab === 'about' ? 'active' : ''}`}
            onClick={() => setCurrentTab('about')}
          >
            <Info size={18} />
            <span>About & Docs</span>
          </button>
        </li>
      </ul>

      {/* Live Model Status Card */}
      <div className="model-status-card">
        <div className="status-header">
          <span className="status-title">Engine</span>
          {isHealthy ? (
            <span className="status-indicator" title="Connected to Gemma 4 Backend" />
          ) : (
            <span title="Backend initializing or offline">
              <AlertCircle size={14} color="#f59e0b" />
            </span>
          )}
        </div>
        <div className="status-model-name">
          {health?.model || 'gemma-4-26b-a4b-it'}
        </div>
        <div className="status-provider">
          Provider: <strong style={{ color: '#e2e8f0' }}>{health?.provider || 'Google API'}</strong>
          {health?.api_key_configured && (
            <span style={{ color: '#10b981', marginLeft: '6px' }} title="API Key Verified">
              <CheckCircle2 size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
            </span>
          )}
        </div>
      </div>
    </aside>
  );
};
