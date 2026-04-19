import React from 'react';
import ReactDOM from 'react-dom/client';
import AssessmentForm from './components/AssessmentForm';
import './index.css';

document.addEventListener('DOMContentLoaded', () => {
  // Create container if it doesn't exist
  let container = document.getElementById('ai-assessment-root');
  if (!container) {
    container = document.createElement('div');
    container.id = 'ai-assessment-root';
    document.body.appendChild(container);
  }
  
  const root = ReactDOM.createRoot(container);
  root.render(<AssessmentForm />);
});