import React, { useState } from 'react';

const IdentitySelector = ({ formData, onIdentityChange, onPrev, onNext }) => {
  const [identityMode, setIdentityMode] = useState(formData.identityMode || '');
  
  const handleIdentityChange = (mode) => {
    setIdentityMode(mode);
    onIdentityChange(mode);
  };
  
  return (
    <div className="card bg-base-100 shadow-xl border border-[#434343]">
      <div className="card-body">
        <h2 className="card-title text-2xl primary-color">Identity Preference</h2>
        <p className="mb-4">Choose how your profile is shown:</p>
        
        <div className="space-y-4">
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-all ${identityMode === 'named' ? 'border-[#CC0000] bg-[#F4CCCD]/20' : 'border-[#434343]'}`}
            onClick={() => handleIdentityChange('named')}
          >
            <div className="flex items-start">
              <div className="mr-3 mt-1">
                <input 
                  type="radio" 
                  name="identityMode" 
                  className="radio radio-primary" 
                  checked={identityMode === 'named'}
                  onChange={() => handleIdentityChange('named')}
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">Named</h3>
                <p className="text-sm">Your trainer and project admin may view your individual AI Fluency Profile.</p>
              </div>
            </div>
          </div>
          
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-all ${identityMode === 'anonymous' ? 'border-[#CC0000] bg-[#F4CCCD]/20' : 'border-[#434343]'}`}
            onClick={() => handleIdentityChange('anonymous')}
          >
            <div className="flex items-start">
              <div className="mr-3 mt-1">
                <input 
                  type="radio" 
                  name="identityMode" 
                  className="radio radio-primary" 
                  checked={identityMode === 'anonymous'}
                  onChange={() => handleIdentityChange('anonymous')}
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">Anonymised</h3>
                <p className="text-sm">Your group leader will only see combined team results. Your trainer may still view your individual profile to help shape the training.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <button className="btn btn-outline" onClick={onPrev}>Previous</button>
          <button className="btn btn-primary" onClick={onNext}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default IdentitySelector;