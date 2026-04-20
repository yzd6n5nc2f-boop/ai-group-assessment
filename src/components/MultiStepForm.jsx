import React, { useState } from 'react';
import ProgressIndicator from './ProgressIndicator';
import SubgroupSelector from './SubgroupSelector';
import IdentitySelector from './IdentitySelector';
import QuestionsSection from './QuestionsSection';

const MultiStepForm = ({ groups, subgroups, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    group: '',
    subgroup: '',
    groupName: '',
    subgroupName: '',
    identityMode: '',
    firstName: '',
    lastName: '',
    email: '',
    answers: {},
    freeText: {}
  });
  
  const totalSteps = 8;
  
  const handleGroupChange = (groupId) => {
    setFormData({ ...formData, group: groupId, subgroup: '', subgroupName: '' });
  };
  
  const handleSubgroupChange = (subgroupId) => {
    setFormData({ ...formData, subgroup: subgroupId });
  };
  
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };
  
  const handleAnswerChange = (questionId, value) => {
    setFormData({
      ...formData,
      answers: {
        ...formData.answers,
        [questionId]: value
      }
    });
  };
  
  const handleFreeTextChange = (field, value) => {
    setFormData({
      ...formData,
      freeText: {
        ...formData.freeText,
        [field]: value
      }
    });
  };
  
  const nextStep = () => {
    // Validation for required fields
    if (currentStep === 1 && !formData.group) {
      alert('Please select a group');
      return;
    }
    
    if (currentStep === 2 && !formData.identityMode) {
      alert('Please select an identity preference');
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };
  
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const handleSubmit = () => {
    onSubmit(formData);
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SubgroupSelector 
            groups={groups} 
            subgroups={subgroups}
            formData={formData}
            onGroupChange={handleGroupChange}
            onSubgroupChange={handleSubgroupChange}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <IdentitySelector 
            formData={formData}
            onIdentityChange={(value) => handleInputChange('identityMode', value)}
            onPrev={prevStep}
            onNext={nextStep}
          />
        );
      case 3:
        return (
          <div className="card bg-base-100 shadow-xl border border-[#434343]">
            <div className="card-body">
              <h2 className="card-title text-2xl primary-color">Personal Information</h2>
              <p className="mb-4">Please provide your details (optional):</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">First Name</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="First name" 
                    className="input input-bordered w-full border-color" 
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Last Name</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Last name" 
                    className="input input-bordered w-full border-color" 
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Email Address (optional)</span>
                </label>
                <input 
                  type="email" 
                  placeholder="your.email@example.com" 
                  className="input input-bordered w-full border-color" 
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
                <span className="text-sm mt-2">Add your email if you would like to receive your individual AI Fluency Profile as a PDF.</span>
              </div>
              
              <div className="flex justify-between items-center mt-6">
                <button className="btn btn-outline" onClick={prevStep}>Previous</button>
                <button className="btn btn-primary" onClick={nextStep}>Next</button>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <QuestionsSection 
            title="Mindset, Attitude and Fears"
            questions={[{
                id: 'q1',
                text: 'How do you currently feel about AI in your work?',
                type: 'single',
                options: [
                  'I avoid it on principle',
                  'I am sceptical and prefer not to use it',
                  'I am cautious but open to it',
                  'I am interested and experimenting',
                  'I am positive and actively using it'
                ]
              },
              {
                id: 'q2',
                text: 'Which statement best reflects your current attitude towards AI?',
                type: 'single',
                options: [
                  'It is mostly a risk',
                  'It is overhyped',
                  'It may be useful in some areas',
                  'It is becoming important for my role',
                  'It is a major opportunity'
                ]
              }]}
            formData={formData}
            onAnswerChange={handleAnswerChange}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 5:
        return (
          <QuestionsSection 
            title="Knowledge and Understanding"
            questions={[{
                id: 'q3',
                text: 'How would you rate your current understanding of AI?',
                type: 'single',
                options: [
                  'No knowledge',
                  'Basic awareness',
                  'Moderate understanding',
                  'Advanced knowledge',
                  'Expert level'
                ]
              },
              {
                id: 'q4',
                text: 'How familiar are you with different types of AI tools and technologies?',
                type: 'single',
                options: [
                  'Not familiar at all',
                  'Heard of some tools',
                  'Familiar with common tools',
                  'Well-versed in multiple tools',
                  'Deep technical knowledge'
                ]
              }]}
            formData={formData}
            onAnswerChange={handleAnswerChange}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 6:
        return (
          <QuestionsSection 
            title="Skills and Experience"
            questions={[{
                id: 'q5',
                text: 'How often do you use AI tools in your work?',
                type: 'single',
                options: [
                  'Never',
                  'Rarely',
                  'Occasionally',
                  'Regularly',
                  'Daily'
                ]
              },
              {
                id: 'q6',
                text: 'How confident are you in applying AI concepts practically?',
                type: 'single',
                options: [
                  'Not confident at all',
                  'Slightly confident',
                  'Moderately confident',
                  'Confident',
                  'Very confident'
                ]
              }]}
            formData={formData}
            onAnswerChange={handleAnswerChange}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 7:
        return (
          <QuestionsSection 
            title="Application and Impact"
            questions={[{
                id: 'q7',
                text: 'How much impact do you think AI could have on your work?',
                type: 'single',
                options: [
                  'No impact',
                  'Minimal impact',
                  'Some impact',
                  'Significant impact',
                  'Transformational impact'
                ]
              },
              {
                id: 'q8',
                text: 'How prepared do you feel to implement AI solutions in your work?',
                type: 'single',
                options: [
                  'Not prepared at all',
                  'Slightly prepared',
                  'Moderately prepared',
                  'Well prepared',
                  'Fully prepared'
                ]
              }]}
            formData={formData}
            onAnswerChange={handleAnswerChange}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 8:
        return (
          <div className="card bg-base-100 shadow-xl border border-[#434343]">
            <div className="card-body">
              <h2 className="card-title text-2xl primary-color">Thank You!</h2>
              <p className="mb-4">Please share any additional thoughts about AI fluency in your organization:</p>
              
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">What challenges do you face with AI adoption?</span>
                </label>
                <textarea 
                  className="textarea textarea-bordered h-24 border-color"
                  placeholder="Share your challenges..."
                  value={formData.freeText.challenges || ''}
                  onChange={(e) => handleFreeTextChange('challenges', e.target.value)}
                ></textarea>
              </div>
              
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">What opportunities do you see for AI in your work?</span>
                </label>
                <textarea 
                  className="textarea textarea-bordered h-24 border-color"
                  placeholder="Share your opportunities..."
                  value={formData.freeText.opportunities || ''}
                  onChange={(e) => handleFreeTextChange('opportunities', e.target.value)}
                ></textarea>
              </div>
              
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Any additional comments about AI fluency?</span>
                </label>
                <textarea 
                  className="textarea textarea-bordered h-24 border-color"
                  placeholder="Share your thoughts..."
                  value={formData.freeText.comments || ''}
                  onChange={(e) => handleFreeTextChange('comments', e.target.value)}
                ></textarea>
              </div>
              
              <div className="flex justify-between items-center mt-6">
                <button className="btn btn-outline" onClick={prevStep}>Previous</button>
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Submit Assessment
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
      <div className="mt-8">
        {renderStep()}
      </div>
    </div>
  );
};

export default MultiStepForm;