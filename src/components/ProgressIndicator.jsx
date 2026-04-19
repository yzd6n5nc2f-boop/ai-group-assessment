import React from 'react';

const ProgressIndicator = ({ currentStep, totalSteps }) => {
  const progressPercentage = (currentStep / totalSteps) * 100;
  
  return (
    <div className="mt-8">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="progress-bar h-2.5 rounded-full bg-[#CC0000]" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="text-right text-sm mt-2 text-[#434343]">Step {currentStep} of {totalSteps}</div>
    </div>
  );
};

export default ProgressIndicator;