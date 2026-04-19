import React from 'react';

const FreeTextQuestion = ({ id, text, value, onChange, condition, answers }) => {
  // Check if the question should be displayed based on condition
  const shouldDisplay = condition ? condition(answers) : true;
  
  if (!shouldDisplay) return null;
  
  return (
    <div className="form-control mb-4">
      <label className="label">
        <span className="label-text">{text}</span>
      </label>
      <textarea 
        id={id}
        className="textarea textarea-bordered w-full border-color" 
        rows="3"
        value={value || ''}
        onChange={(e) => onChange(id, e.target.value)}
      />
    </div>
  );
};

export default FreeTextQuestion;