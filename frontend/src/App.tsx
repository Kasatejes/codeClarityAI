import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { CodeWorkspace } from './components/CodeWorkspace';
import { DebugReport } from './components/DebugReport';
import { LearnView } from './components/LearnView';
import { AboutView } from './components/AboutView';
import type { AnalyzeResponse, HealthResponse } from './types';
import { getHealth, analyzeCode } from './api';
import { SAMPLE_SNIPPETS } from './data/samples';
import { Check, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'debugger' | 'learn' | 'about'>('debugger');
  const [language, setLanguage] = useState<'python' | 'cpp'>('python');
  const [code, setCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [report, setReport] = useState<AnalyzeResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load initial health status & default demo sample
  useEffect(() => {
    getHealth().then((h) => setHealth(h));

    // Pre-populate with a beginner-friendly sample so the user can immediately test
    const defaultSample = SAMPLE_SNIPPETS[0];
    setCode(defaultSample.code);
    setErrorMessage(defaultSample.errorMessage);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleAnalyze = async () => {
    setValidationError(null);

    // Validation: Require either code or an image
    if (!code.trim() && !imageFile) {
      setValidationError('Please enter code or upload an error screenshot before analyzing.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await analyzeCode(code, language, errorMessage, imageFile);
      setReport(result);
      showToast('Analysis completed by Gemma 4!');
    } catch (err: any) {
      setValidationError(err.message || 'An unexpected error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCode('');
    setErrorMessage('');
    setImageFile(null);
    setImagePreview(null);
    setReport(null);
    setValidationError(null);
    showToast('Workspace reset.');
  };

  return (
    <div className="app-layout">
      {/* Left Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        health={health}
      />

      {/* Main App Content */}
      <div className="main-wrapper">
        {/* Top Header Bar */}
        <header className="topbar">
          <div className="topbar-left">
            <h2 className="page-title">
              {currentTab === 'debugger' && 'Code Debugging & Tutor'}
              {currentTab === 'learn' && 'Computer Science Concept Hub'}
              {currentTab === 'about' && 'About & Technical Architecture'}
            </h2>
          </div>

          <div className="topbar-right">
            <span className="badge badge-violet">
              <Sparkles size={12} />
              <span>Gemma 4 Tutor</span>
            </span>
            <span className="badge badge-blue">
              <span>{language === 'python' ? 'Python 3' : 'C++ 20'}</span>
            </span>
          </div>
        </header>

        {/* Tab View Container */}
        <main className="content-container">
          {currentTab === 'debugger' && (
            <div className="debugger-grid">
              {/* Left Column: Code Workspace */}
              <CodeWorkspace
                language={language}
                setLanguage={(lang) => {
                  setLanguage(lang);
                  // Load first sample for that language if code is empty
                  const sample = SAMPLE_SNIPPETS.find((s) => s.language === lang);
                  if (sample && !code.trim()) {
                    setCode(sample.code);
                    setErrorMessage(sample.errorMessage);
                  }
                }}
                code={code}
                setCode={setCode}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                imageFile={imageFile}
                setImageFile={setImageFile}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                onAnalyze={handleAnalyze}
                onReset={handleReset}
                isLoading={isLoading}
                validationError={validationError}
              />

              {/* Right Column: Structured Debugging Report */}
              <DebugReport
                report={report}
                isLoading={isLoading}
                onViewConcept={() => setCurrentTab('learn')}
                onCopySuccess={() => showToast('Corrected code copied to clipboard!')}
              />
            </div>
          )}

          {currentTab === 'learn' && (
            <LearnView
              currentConcept={report?.learning_concept || null}
              onBackToDebugger={() => setCurrentTab('debugger')}
            />
          )}

          {currentTab === 'about' && (
            <AboutView onBackToDebugger={() => setCurrentTab('debugger')} />
          )}
        </main>
      </div>

      {/* Global Toast */}
      {toastMessage && (
        <div className="toast">
          <Check size={16} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default App;
