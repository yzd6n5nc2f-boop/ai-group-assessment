import React, { useState, useEffect } from 'react';

const QuestionsSection = ({ 
  title, 
  questions, 
  answers, 
  freeText, 
  onAnswerChange, 
  onFreeTextChange, 
  onPrev, 
  onNext, 
  onSubmit, 
  isFinalStep, 
  isSubmitting 
}) => {
  // Local state for answers to handle multi-select
  const [localAnswers, setLocalAnswers] = useState({});
  
  useEffect(() => {
    setLocalAnswers({ ...answers });
  }, [answers]);
  
  // Handle single select change
  const handleSingleSelectChange = (questionId, value) => {
    onAnswerChange(questionId, value);
  };
  
  // Handle multi select change
  const handleMultiSelectChange = (questionId, option, isChecked) => {
    const currentSelections = localAnswers[questionId] || [];
    let newSelections;
    
    if (isChecked) {
      newSelections = [...currentSelections, option];
    } else {
      newSelections = currentSelections.filter(item => item !== option);
    }
    
    setLocalAnswers({
      ...localAnswers,
      [questionId]: newSelections
    });
    
    onAnswerChange(questionId, newSelections);
  };
  
  // Handle free text change
  const handleFreeTextChange = (field, value) => {
    onFreeTextChange(field, value);
  };
  
  // Check if a conditional question should be shown
  const shouldShowQuestion = (question) => {
    if (!question.condition) return true;
    return question.condition(answers);
  };
  
  // Filter questions based on conditions
  const filteredQuestions = questions.filter(shouldShowQuestion);
  
  return (
    <div className="card bg-base-100 shadow-xl border border-[#434343]">
      <div className="card-body">
        <h2 className="card-title text-2xl primary-color">{title}</h2>
        <p className="mb-4">Please answer the following questions:</p>
        
        <div className="space-y-6">
          {filteredQuestions.map((question, index) => {
            if (question.type === 'single') {
              return (
                <div key={question.id} className="form-control">
                  <label className="label">
                    <span className="label-text">{question.text}</span>
                  </label>
                  <div className="space-y-2">
                    {question.options.map((option, i) => (
                      <label key={i} className="label cursor-pointer justify-start">
                        <input 
                          type="radio" 
                          name={question.id} 
                          className="radio radio-primary" 
                          value={i}
                          checked={answers[question.id] == i}
                          onChange={() => handleSingleSelectChange(question.id, i.toString())}
                        />
                        <span className="label-text ml-2">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            } else if (question.type === 'multi') {
              return (
                <div key={question.id} className="form-control">
                  <label className="label">
                    <span className="label-text">{question.text}</span>
                  </label>
                  <div className="space-y-2">
                    {question.options.map((option, i) => (
                      <label key={i} className="label cursor-pointer justify-start">
                        <input 
                          type="checkbox" 
                          name={`${question.id}_${i}`} 
                          className="checkbox checkbox-primary" 
                          checked={(localAnswers[question.id] || []).includes(option)}
                          onChange={(e) => handleMultiSelectChange(question.id, option, e.target.checked)}
                        />
                        <span className="label-text ml-2">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            } else if (question.type === 'text') {
              return (
                <div key={question.id} className="form-control">
                  <label className="label">
                    <span className="label-text">{question.text}</span>
                  </label>
                  <textarea 
                    className="textarea textarea-bordered w-full border-color" 
                    rows="3"
                    value={freeText[question.id] || ''}
                    onChange={(e) => handleFreeTextChange(question.id, e.target.value)}
                  />
                </div>
              );
            }
            return null;
          })}
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <button className="btn btn-outline" onClick={onPrev}>Previous</button>
          {isFinalStep ? (
            <button 
              className="btn btn-primary" 
              onClick={onSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Submitting...
                </>
              ) : 'Submit'}
            </button>
          ) : (
            <button className="btn btn-primary" onClick={onNext}>Next</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionsSection;