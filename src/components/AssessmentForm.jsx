import React, { useState, useEffect } from 'react';
import GroupSelector from './GroupSelector';
import IdentitySelector from './IdentitySelector';
import QuestionsSection from './QuestionsSection';
import { fetchGroups, fetchSubgroups, saveResponseToAirtable } from '../services/airtableService';
import { generateAndSendPDF } from '../services/pdfService';
import { calculateProfileValues, getAnonymizationFlags } from '../utils/calculationUtils';

const AssessmentForm = () => {
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
  
  const [groups, setGroups] = useState([]);
  const [subgroups, setSubgroups] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const totalSteps = 8;
  
  // Load groups on component mount
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const fetchedGroups = await fetchGroups();
        setGroups(fetchedGroups);
      } catch (error) {
        console.error('Error loading groups:', error);
      }
    };
    
    loadGroups();
  }, []);
  
  const handleGroupChange = async (groupId) => {
    setFormData({ ...formData, group: groupId, subgroup: '', subgroupName: '' });
    
    // Load subgroups based on group selection
    if (groupId) {
      try {
        const fetchedSubgroups = await fetchSubgroups(groupId);
        setSubgroups(fetchedSubgroups);
        
        // Update group name
        const group = groups.find(g => g.id === groupId);
        if (group) {
          setFormData(prev => ({ ...prev, groupName: group.name }));
        }
      } catch (error) {
        console.error('Error loading subgroups:', error);
        setSubgroups([]);
      }
    } else {
      setSubgroups([]);
    }
  };
  
  const handleSubgroupChange = (subgroupId) => {
    setFormData({ ...formData, subgroup: subgroupId });
    
    // Update subgroup name
    const subgroup = subgroups.find(s => s.id === subgroupId);
    if (subgroup) {
      setFormData(prev => ({ ...prev, subgroupName: subgroup.name }));
    }
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
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Calculate profile values
      const profileValues = calculateProfileValues(formData.answers);
      
      // Get anonymization flags
      const anonymizationFlags = getAnonymizationFlags(formData.identityMode);
      
      // Prepare data for Airtable
      const responseData = {
        ...formData,
        ...profileValues,
        ...anonymizationFlags,
        submissionDatetime: new Date().toISOString()
      };
      
      // Save to Airtable
      const saveResult = await saveResponseToAirtable(responseData);
      
      // Generate and send PDF if email is provided
      if (formData.email) {
        await generateAndSendPDF(responseData);
      }
      
      // Move to thank you screen
      setCurrentStep(totalSteps + 1);
    } catch (error) {
      console.error('Error submitting assessment:', error);
      setSubmitError('There was an error submitting your assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <GroupSelector 
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
            questions={[
              {
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
                  'It is a major opportunity if used properly'
                ]
              },
              {
                id: 'q3',
                text: 'What is your biggest concern about AI?',
                type: 'single',
                options: [
                  'I do not trust it at all',
                  'It may replace jobs',
                  'It is inaccurate',
                  'It creates security or privacy risks',
                  'I am more concerned about not knowing how to use it well'
                ]
              },
              {
                id: 'q4',
                text: 'How strongly do you agree: "AI will enhance many jobs more than it replaces them."',
                type: 'single',
                options: [
                  'Strongly disagree',
                  'Disagree',
                  'Neither',
                  'Agree',
                  'Strongly agree'
                ]
              },
              {
                id: 'q5',
                text: 'How strongly do you agree: "I feel confident enough to experiment with AI."',
                type: 'single',
                options: [
                  'Strongly disagree',
                  'Disagree',
                  'Neither',
                  'Agree',
                  'Strongly agree'
                ]
              },
              {
                id: 'q6',
                text: 'Do you currently avoid using AI for any reason?',
                type: 'single',
                options: [
                  'Yes, on principle',
                  'Yes, because I do not trust it',
                  'Yes, because I do not know how to use it properly',
                  'Sometimes, depending on the task',
                  'No, I use it where it makes sense'
                ]
              },
              {
                id: 'txt_reason_for_avoidance',
                text: 'If yes or sometimes, what is the main reason?',
                type: 'text',
                condition: (answers) => ['0', '1', '2', '3'].includes(answers.q6)
              }
            ]}
            answers={formData.answers}
            freeText={formData.freeText}
            onAnswerChange={handleAnswerChange}
            onFreeTextChange={handleFreeTextChange}
            onPrev={prevStep}
            onNext={nextStep}
          />
        );
      case 5:
        return (
          <QuestionsSection 
            title="Usage, Frequency and Context"
            questions={[
              {
                id: 'q7',
                text: 'How often do you use AI tools of any kind?',
                type: 'single',
                options: [
                  'Never',
                  'Rarely',
                  'Occasionally',
                  'Weekly',
                  'Daily'
                ]
              },
              {
                id: 'q8',
                text: 'Where do you mainly use AI?',
                type: 'single',
                options: [
                  'I do not use it',
                  'Personal use only',
                  'Mostly personal, occasionally work',
                  'Mostly work, occasionally personal',
                  'Regularly for both personal and work use'
                ]
              },
              {
                id: 'q9',
                text: 'How often do you use AI for work-related tasks?',
                type: 'single',
                options: [
                  'Never',
                  'Rarely',
                  'Occasionally',
                  'Weekly',
                  'Daily'
                ]
              },
              {
                id: 'q10',
                text: 'How often do you use AI for personal tasks?',
                type: 'single',
                options: [
                  'Never',
                  'Rarely',
                  'Occasionally',
                  'Weekly',
                  'Daily'
                ]
              },
              {
                id: 'q11',
                text: 'Which main AI platforms have you used? Select all that apply.',
                type: 'multi',
                options: [
                  'ChatGPT',
                  'Claude',
                  'Gemini',
                  'Microsoft Copilot',
                  'Perplexity',
                  'Grok',
                  'Other',
                  'None'
                ]
              },
              {
                id: 'q12',
                text: 'Which additional AI tools have you used alongside the main platforms? Select all that apply.',
                type: 'multi',
                options: [
                  'NotebookLM',
                  'Gamma',
                  'Canva AI tools',
                  'Fireflies',
                  'Otter',
                  'Midjourney',
                  'Sora',
                  'Zapier or Make with AI',
                  'Other',
                  'None'
                ]
              },
              {
                id: 'q13',
                text: 'What do you mainly use AI for today? Select all that apply.',
                type: 'multi',
                options: [
                  'Basic questions or search',
                  'Writing emails or messages',
                  'Summarising documents',
                  'Brainstorming ideas',
                  'Research',
                  'Content creation',
                  'Planning',
                  'Analysis',
                  'Image generation',
                  'Meeting notes',
                  'I do not use it'
                ]
              },
              {
                id: 'txt_other_tools',
                text: 'If you selected Other above, please list any other AI tools you use.',
                type: 'text',
                condition: (answers) => answers.q11?.includes('Other') || answers.q12?.includes('Other')
              },
              {
                id: 'txt_current_use',
                text: 'What do you currently use AI for, if anything?',
                type: 'text'
              }
            ]}
            answers={formData.answers}
            freeText={formData.freeText}
            onAnswerChange={handleAnswerChange}
            onFreeTextChange={handleFreeTextChange}
            onPrev={prevStep}
            onNext={nextStep}
          />
        );
      case 6:
        return (
          <QuestionsSection 
            title="Prompting and Core Skill"
            questions={[
              {
                id: 'q14',
                text: 'How would you describe the way you usually prompt AI?',
                type: 'single',
                options: [
                  'I ask very basic questions',
                  'I give a little context',
                  'I give clear instructions',
                  'I structure prompts with goal, context and output',
                  'I build prompts in a deliberate and repeatable way'
                ]
              },
              {
                id: 'q15',
                text: 'When using AI, how often do you give it relevant context before asking for an answer?',
                type: 'single',
                options: [
                  'Never',
                  'Rarely',
                  'Sometimes',
                  'Often',
                  'Always'
                ]
              },
              {
                id: 'q16',
                text: 'Have you used AI to help you write or improve a prompt?',
                type: 'single',
                options: [
                  'Never',
                  'Tried once',
                  'Occasionally',
                  'Regularly',
                  'This is part of my normal process'
                ]
              },
              {
                id: 'q17',
                text: 'Have you asked AI to ask you questions before producing the final answer?',
                type: 'single',
                options: [
                  'Never',
                  'Rarely',
                  'Sometimes',
                  'Often',
                  'Almost always where needed'
                ]
              },
              {
                id: 'q18',
                text: 'When the first answer is weak, what do you usually do?',
                type: 'single',
                options: [
                  'I stop using it',
                  'I ask again in a similar way',
                  'I make one or two changes',
                  'I refine the context and instructions',
                  'I iterate deliberately until the output is useful'
                ]
              },
              {
                id: 'q19',
                text: 'How good are you at getting AI to match a tone, structure or format you want?',
                type: 'single',
                options: [
                  'Not good at all',
                  'Limited',
                  'Fair',
                  'Good',
                  'Very good'
                ]
              }
            ]}
            answers={formData.answers}
            freeText={formData.freeText}
            onAnswerChange={handleAnswerChange}
            onFreeTextChange={handleFreeTextChange}
            onPrev={prevStep}
            onNext={nextStep}
          />
        );
      case 7:
        return (
          <QuestionsSection 
            title="Research, Judgement and Quality of Use"
            questions={[
              {
                id: 'q20',
                text: 'Have you used AI for deeper research rather than just quick answers?',
                type: 'single',
                options: [
                  'Never',
                  'Rarely',
                  'Sometimes',
                  'Often',
                  'Regularly for structured research tasks'
                ]
              },
              {
                id: 'q21',
                text: 'Have you used a deep research function within an AI platform?',
                type: 'single',
                options: [
                  'No, never',
                  'I have heard of it but not used it',
                  'Tried once or twice',
                  'Used it a few times',
                  'Use it confidently where appropriate'
                ]
              },
              {
                id: 'q22',
                text: 'How often do you check or verify AI outputs before using them in important work?',
                type: 'single',
                options: [
                  'Never',
                  'Rarely',
                  'Sometimes',
                  'Often',
                  'Always'
                ]
              },
              {
                id: 'q23',
                text: 'Have you compared outputs across more than one AI platform?',
                type: 'single',
                options: [
                  'Never',
                  'Tried once',
                  'Occasionally',
                  'Regularly',
                  'I deliberately use different tools for different strengths'
                ]
              }
            ]}
            answers={formData.answers}
            freeText={formData.freeText}
            onAnswerChange={handleAnswerChange}
            onFreeTextChange={handleFreeTextChange}
            onPrev={prevStep}
            onNext={nextStep}
          />
        );
      case 8:
        return (
          <QuestionsSection 
            title="Projects, Customisation and Workflow Maturity"
            questions={[
              {
                id: 'q24',
                text: 'Have you used Projects, custom GPTs, Gems, or similar AI workspaces?',
                type: 'single',
                options: [
                  'Never',
                  'I have heard of them but not used them',
                  'Tried once or twice',
                  'Used them a few times',
                  'Use them regularly for defined purposes'
                ]
              },
              {
                id: 'q25',
                text: 'If you have used Projects, custom GPTs, Gems, or similar, how advanced was your setup?',
                type: 'single',
                options: [
                  'I have not used them',
                  'Used defaults only',
                  'Added a custom prompt or instruction',
                  'Added a custom prompt plus files or knowledge',
                  'Built a bespoke setup for a repeated task or workflow'
                ]
              },
              {
                id: 'txt_training_help',
                text: 'What would you most like AI training to help you with?',
                type: 'text'
              },
              {
                id: 'txt_specific_training_questions',
                text: 'Do you have any specific questions you would like the training to cover?',
                type: 'text'
              },
              {
                id: 'txt_other_comments',
                text: 'Any other comments about AI, your role, or your current experience?',
                type: 'text'
              }
            ]}
            answers={formData.answers}
            freeText={formData.freeText}
            onAnswerChange={handleAnswerChange}
            onFreeTextChange={handleFreeTextChange}
            onPrev={prevStep}
            onSubmit={handleSubmit}
            isFinalStep={true}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return (
          <div className="card bg-base-100 shadow-xl border border-[#434343]">
            <div className="card-body text-center py-12">
              <div className="text-[#CC0000] mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-8.93"></path>
                  <polyline points="22,4 12,14.01 9,11.01"></polyline>
                </svg>
              </div>
              <h2 className="card-title text-2xl primary-color justify-center">Thank You!</h2>
              <p className="mb-4">Your responses have been recorded.</p>
              <p className="mb-4">These insights will help shape the training.</p>
              <p>You may also find our AI articles useful while you wait for the session.</p>
              {submitError && (
                <div className="alert alert-error mt-6">
                  <span>{submitError}</span>
                </div>
              )}
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="assessment-form max-w-4xl mx-auto p-4 md:p-6">
      {renderStep()}
      
      {/* Progress bar */}
      {currentStep <= totalSteps && (
        <div className="mt-8">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="progress-bar h-2.5 rounded-full" 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
          <div className="text-right text-sm mt-2">Step {currentStep} of {totalSteps}</div>
        </div>
      )}
    </div>
  );
};

export default AssessmentForm;