import React, { useRef } from 'react';
import {
  Code2,
  Upload,
  Trash2,
  Play,
  RotateCcw,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { SAMPLE_SNIPPETS } from '../data/samples';
import type { SampleSnippet } from '../types';

interface CodeWorkspaceProps {
  language: 'python' | 'cpp';
  setLanguage: (lang: 'python' | 'cpp') => void;
  code: string;
  setCode: (code: string) => void;
  errorMessage: string;
  setErrorMessage: (msg: string) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  imagePreview: string | null;
  setImagePreview: (url: string | null) => void;
  onAnalyze: () => void;
  onReset: () => void;
  isLoading: boolean;
  validationError: string | null;
}

export const CodeWorkspace: React.FC<CodeWorkspaceProps> = ({
  language,
  setLanguage,
  code,
  setCode,
  errorMessage,
  setErrorMessage,
  imageFile,
  setImageFile,
  imagePreview,
  setImagePreview,
  onAnalyze,
  onReset,
  isLoading,
  validationError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredSamples = SAMPLE_SNIPPETS.filter((s) => s.language === language);

  const handleLoadSample = (sample: SampleSnippet) => {
    setCode(sample.code);
    setErrorMessage(sample.errorMessage);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      alert('Please upload a PNG, JPG, or JPEG image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image exceeds the 5MB size limit.');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const lineCount = code.split('\n').length;

  return (
    <div className="card">
      {/* Workspace Header */}
      <div className="card-header">
        <div className="card-title-group">
          <Code2 size={20} className="card-icon" />
          <h2 className="card-title">Code Debugging Workspace</h2>
        </div>

        {/* Language Selector */}
        <div className="tab-group">
          <button
            className={`tab-btn ${language === 'python' ? 'active' : ''}`}
            onClick={() => setLanguage('python')}
          >
            Python
          </button>
          <button
            className={`tab-btn ${language === 'cpp' ? 'active' : ''}`}
            onClick={() => setLanguage('cpp')}
          >
            C++
          </button>
        </div>
      </div>

      {/* Quick-Load Sample Snippets Bar */}
      <div className="samples-bar">
        <span className="samples-label">Quick Samples:</span>
        {filteredSamples.map((sample) => (
          <button
            key={sample.id}
            className="sample-chip"
            onClick={() => handleLoadSample(sample)}
            title={sample.category}
          >
            <Sparkles size={12} color="#8b5cf6" />
            <span>{sample.title.split(': ')[1]}</span>
          </button>
        ))}
      </div>

      {/* Validation Error Alert */}
      {validationError && (
        <div className="alert alert-error">
          <AlertTriangle size={16} />
          <span>{validationError}</span>
        </div>
      )}

      {/* Code Editor */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div className="editor-container">
          <div className="editor-header">
            <span>{language === 'python' ? 'main.py' : 'main.cpp'}</span>
            <span>{lineCount} lines</span>
          </div>
          <textarea
            className="editor-textarea"
            placeholder={
              language === 'python'
                ? '# Paste your Python code here...\ndef calculate():\n    ...'
                : '// Paste your C++ code here...\n#include <iostream>\nint main() {\n    ...\n}'
            }
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          />
        </div>
      </div>

      {/* Error Message Input */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label className="input-label" htmlFor="error-input">
          Error Message or Problem Description (Optional)
        </label>
        <textarea
          id="error-input"
          className="error-input"
          placeholder="e.g., IndexError: list index out of range on line 12, or describe unexpected output..."
          value={errorMessage}
          onChange={(e) => setErrorMessage(e.target.value)}
        />
      </div>

      {/* Screenshot Upload */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label className="input-label">Screenshot Analysis (PNG, JPG, JPEG &le; 5MB)</label>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleImageSelect}
        />

        {!imagePreview ? (
          <div
            className="upload-dropzone"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={24} style={{ color: '#8b5cf6', marginBottom: '0.4rem' }} />
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500 }}>
              Click to upload a terminal or IDE screenshot
            </p>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
              Gemma 4 will inspect visible error messages and code
            </p>
          </div>
        ) : (
          <div className="upload-dropzone has-file">
            <div className="preview-box">
              <img src={imagePreview} alt="Error Screenshot" className="preview-thumb" />
              <div className="preview-meta">
                <div className="preview-name">{imageFile?.name || 'Screenshot'}</div>
                <div className="preview-size">
                  {imageFile ? `${(imageFile.size / 1024).toFixed(1)} KB` : ''}
                </div>
              </div>
              <button
                className="btn-secondary btn-danger"
                onClick={handleRemoveImage}
                title="Remove Screenshot"
              >
                <Trash2 size={14} />
                <span>Remove</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          className="btn-primary"
          onClick={onAnalyze}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
              <span>Analyzing with Gemma 4...</span>
            </>
          ) : (
            <>
              <Play size={16} fill="white" />
              <span>Analyze Code</span>
            </>
          )}
        </button>

        <button
          className="btn-secondary"
          onClick={onReset}
          disabled={isLoading}
          title="Clear code, errors, and results"
        >
          <RotateCcw size={15} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
