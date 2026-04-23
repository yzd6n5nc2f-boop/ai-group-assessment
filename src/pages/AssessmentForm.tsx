import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Types
type Group = {
  id: string;
  name: string;
};

type Subgroup = {
  id: string;
  name: string;
};

type FormData = {
  group: string;
  groupName: string;
  subgroup: string;
  subgroupName: string;
  identityMode: string;
  firstName: string;
  lastName: string;
  email: string;
  // Section 1 - Mindset
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
  txt_reason_for_avoidance: string;
  // Section 2 - Usage
  q7: string;
  q8: string;
  q9: string;
  q10: string;
  q11: string[];
  q12: string[];
  q13: string[];
  txt_other_tools: string;
  txt_current_use: string;
  // Section 3 - Prompting
  q14: string;
  q15: string;
  q16: string;
  q17: string;
  q18: string;
  q19: string;
  // Section 4 - Research
  q20: string;
  q21: string;
  q22: string;
  q23: string;
  // Section 5 - Workflow
  q24: string;
  q25: string;
  // Additional free-text
  txt_training_help: string;
  txt_specific_training_questions: string;
  txt_other_comments: string;
};

// Main Assessment Form Component
export function AssessmentForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    group: '',
    groupName: '',
    subgroup: '',
    subgroupName: '',
    identityMode: '',
    firstName: '',
    lastName: '',
    email: '',
    // Section 1 - Mindset
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: '',
    txt_reason_for_avoidance: '',
    // Section 2 - Usage
    q7: '',
    q8: '',
    q9: '',
    q10: '',
    q11: [],
    q12: [],
    q13: [],
    txt_other_tools: '',
    txt_current_use: '',
    // Section 3 - Prompting
    q14: '',
    q15: '',
    q16: '',
    q17: '',
    q18: '',
    q19: '',
    // Section 4 - Research
    q20: '',
    q21: '',
    q22: '',
    q23: '',
    // Section 5 - Workflow
    q24: '',
    q25: '',
    // Additional free-text
    txt_training_help: '',
    txt_specific_training_questions: '',
    txt_other_comments: ''
  });
  
  const [groups, setGroups] = useState<Group[]>([]);
  const [subgroups, setSubgroups] = useState<Subgroup[]>([]);
  const [showSubgroup, setShowSubgroup] = useState(false);
  
  const navigate = useNavigate();
  
  // Load groups on component mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get<Group[]>('/api/ai/groups');
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
        // Fallback data
        setGroups([
          { id: 'premier-sports-team', name: 'Premier Sports Team' },
          { id: 'may-sme-ai-masterclass', name: 'May SME AI Masterclass' }
        ]);
      }
    };
    
    fetchGroups();
  }, []);
  
  // Handle group change
  const handleGroupChange = async (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setFormData(prev => ({
        ...prev,
        group: groupId,
        groupName: group.name,
        subgroup: '',
        subgroupName: ''
      }));
      
      if (groupId) {
        try {
          const response = await axios.get<Subgroup[]>(`/api/ai/subgroups/${groupId}`);
          setSubgroups(response.data);
          setShowSubgroup(response.data.length > 0);
        } catch (error) {
          console.error('Error fetching subgroups:', error);
          setSubgroups([]);
          setShowSubgroup(false);
        }
      } else {
        setSubgroups([]);
        setShowSubgroup(false);
      }
    }
  };
  
  // Update form data
  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Special handling for subgroup name
    if (field === 'subgroup') {
      const subgroup = subgroups.find(sg => sg.id === value);
      if (subgroup) {
        setFormData(prev => ({ ...prev, subgroupName: subgroup.name }));
      }
    }
    
    // Special handling for group name
    if (field === 'group') {
      const group = groups.find(g => g.id === value);
      if (group) {
        setFormData(prev => ({ ...prev, groupName: group.name }));
      }
    }
  };
  
  // Update multi-select data
  const updateMultiSelect = (questionNumber: string, option: string, isChecked: boolean) => {
    const field = `q${questionNumber}` as keyof FormData;
    const currentValues = [...(formData[field] as string[])];
    
    if (isChecked) {
      if (!currentValues.includes(option)) {
        currentValues.push(option);
      }
    } else {
      const index = currentValues.indexOf(option);
      if (index > -1) {
        currentValues.splice(index, 1);
      }
    }
    
    setFormData(prev => ({ ...prev, [field]: currentValues }));
  };
  
  // Navigation functions
  const nextStep = () => {
    if (step < 8) {
      setStep(step + 1);
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  // Submit assessment
  const submitAssessment = async () => {
    try {
      // Prepare data for submission
      const submissionData = {
        groupId: formData.group,
        groupName: formData.groupName,
        subgroupId: formData.subgroup,
        subgroupName: formData.subgroupName,
        identityMode: formData.identityMode,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        q1: formData.q1,
        q2: formData.q2,
        q3: formData.q3,
        q4: formData.q4,
        q5: formData.q5,
        q6: formData.q6,
        txtReasonForAvoidance: formData.txt_reason_for_avoidance,
        q7: formData.q7,
        q8: formData.q8,
        q9: formData.q9,
        q10: formData.q10,
        q11: formData.q11,
        q12: formData.q12,
        q13: formData.q13,
        txtOtherTools: formData.txt_other_tools,
        txtCurrentUse: formData.txt_current_use,
        q14: formData.q14,
        q15: formData.q15,
        q16: formData.q16,
        q17: formData.q17,
        q18: formData.q18,
        q19: formData.q19,
        q20: formData.q20,
        q21: formData.q21,
        q22: formData.q22,
        q23: formData.q23,
        q24: formData.q24,
        q25: formData.q25,
        txtTrainingHelp: formData.txt_training_help,
        txtSpecificTrainingQuestions: formData.txt_specific_training_questions,
        txtOtherComments: formData.txt_other_comments
      };
      
      // Send data to backend
      await axios.post('/api/ai/responses', submissionData);
      
      // Navigate to results page
      navigate('/results');
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert('There was an error submitting your assessment. Please try again.');
    }
  };
  
  // Render current step
  const renderStep = () => {
    switch(step) {
      case 1: return <GroupSelectionStep 
        formData={formData} 
        groups={groups} 
        subgroups={subgroups} 
        showSubgroup={showSubgroup}
        handleGroupChange={handleGroupChange}
        updateFormData={updateFormData}
        nextStep={nextStep} 
      />;
      case 2: return <IdentitySelectionStep 
        formData={formData} 
        updateFormData={updateFormData}
        prevStep={prevStep}
        nextStep={nextStep} 
      />;
      case 3: return <PersonalInfoStep 
        formData={formData} 
        updateFormData={updateFormData}
        prevStep={prevStep}
        nextStep={nextStep} 
      />;
      case 4: return <MindsetSectionStep 
        formData={formData} 
        updateFormData={updateFormData}
        prevStep={prevStep}
        nextStep={nextStep} 
      />;
      case 5: return <UsageSectionStep 
        formData={formData} 
        updateFormData={updateFormData}
        updateMultiSelect={updateMultiSelect}
        prevStep={prevStep}
        nextStep={nextStep} 
      />;
      case 6: return <RemainingSectionsStep 
        formData={formData} 
        updateFormData={updateFormData}
        updateMultiSelect={updateMultiSelect}
        prevStep={prevStep}
        nextStep={nextStep}
      />;
      case 7: return <FinalQuestionsStep 
        formData={formData}
        updateFormData={updateFormData}
        prevStep={prevStep}
        submitAssessment={submitAssessment} 
      />;
      case 8: return <CompletionStep formData={formData} />;
      default: return <GroupSelectionStep 
        formData={formData} 
        groups={groups} 
        subgroups={subgroups} 
        showSubgroup={showSubgroup}
        handleGroupChange={handleGroupChange}
        updateFormData={updateFormData}
        nextStep={nextStep} 
      />;
    }
  };
  
  return (
    <div className="assessment-survey max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-1 bg-primary"></div>
      <div className="p-8">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${((step - 1) / 7) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mb-8">
          <span>Step {step} of 8</span>
          <span>{Math.round(((step - 1) / 7) * 100)}% Complete</span>
        </div>
        
        {/* Step Content */}
        {renderStep()}
      </div>
    </div>
  );
}

// Step Components
function GroupSelectionStep({ 
  formData, 
  groups, 
  subgroups, 
  showSubgroup, 
  handleGroupChange, 
  updateFormData, 
  nextStep 
}: { 
  formData: FormData; 
  groups: Group[]; 
  subgroups: Subgroup[]; 
  showSubgroup: boolean; 
  handleGroupChange: (groupId: string) => void; 
  updateFormData: (field: keyof FormData, value: any) => void; 
  nextStep: () => void; 
}) {
  const requiresSubgroup = showSubgroup && subgroups.length > 0;
  const canContinue = Boolean(formData.group) && (!requiresSubgroup || Boolean(formData.subgroup));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Welcome to the AI Fluency Assessment</h2>
      <p className="mb-6 text-center">Please select your group/company to begin the assessment.</p>
      
      <div className="form-control mb-6">
        <label className="label font-bold">Which group are you part of?</label>
        <select 
          className="select select-bordered w-full" 
          value={formData.group}
          onChange={(e) => handleGroupChange(e.target.value)}
        >
          <option disabled value="">Select your group</option>
          {groups.map(group => (
            <option key={group.id} value={group.id}>{group.name}</option>
          ))}
        </select>
      </div>
      
      {showSubgroup && (
        <div className="form-control mb-6">
          <label className="label font-bold">Which division or subgroup are you part of?</label>
          <select 
            className="select select-bordered w-full" 
            value={formData.subgroup}
            onChange={(e) => updateFormData('subgroup', e.target.value)}
          >
            <option disabled value="">Select your subgroup</option>
            {subgroups.map(subgroup => (
              <option key={subgroup.id} value={subgroup.id}>{subgroup.name}</option>
            ))}
          </select>
        </div>
      )}
      
      <div className="flex justify-between mt-8">
        <button className="btn btn-ghost" disabled>Previous</button>
        <button 
          className="btn btn-primary" 
          onClick={nextStep}
          disabled={!canContinue}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function IdentitySelectionStep({ 
  formData, 
  updateFormData, 
  prevStep, 
  nextStep 
}: { 
  formData: FormData; 
  updateFormData: (field: keyof FormData, value: any) => void; 
  prevStep: () => void; 
  nextStep: () => void; 
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Identity Preference</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Choose how your profile is shown</h3>
        <div className="space-y-4">
          <div 
            className={`border rounded-lg p-4 cursor-pointer ${formData.identityMode === 'named' ? 'border-primary bg-base-200' : ''}`}
            onClick={() => updateFormData('identityMode', 'named')}
          >
            <div className="flex items-start">
              <div className="mr-3 mt-1">
                <input 
                  type="radio" 
                  className="radio radio-primary" 
                  checked={formData.identityMode === 'named'}
                  readOnly
                />
              </div>
              <div>
                <h4 className="font-bold">Named</h4>
                <p className="text-sm mt-1">Your trainer and project admin may view your individual AI Fluency Profile.</p>
              </div>
            </div>
          </div>
          
          <div 
            className={`border rounded-lg p-4 cursor-pointer ${formData.identityMode === 'anonymised' ? 'border-primary bg-base-200' : ''}`}
            onClick={() => updateFormData('identityMode', 'anonymised')}
          >
            <div className="flex items-start">
              <div className="mr-3 mt-1">
                <input 
                  type="radio" 
                  className="radio radio-primary" 
                  checked={formData.identityMode === 'anonymised'}
                  readOnly
                />
              </div>
              <div>
                <h4 className="font-bold">Anonymised</h4>
                <p className="text-sm mt-1">Your group leader will only see combined team results. Your trainer may still view your individual profile to help shape the training.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <button className="btn btn-ghost" onClick={prevStep}>Previous</button>
        <button 
          className="btn btn-primary" 
          onClick={nextStep}
          disabled={!formData.identityMode}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function PersonalInfoStep({ 
  formData, 
  updateFormData, 
  prevStep, 
  nextStep 
}: { 
  formData: FormData; 
  updateFormData: (field: keyof FormData, value: any) => void; 
  prevStep: () => void; 
  nextStep: () => void; 
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">Personal Information</h2>
      <p className="mb-6 text-center">Please provide your details (optional except where marked).</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="form-control">
          <label className="label">First Name (optional)</label>
          <input 
            type="text" 
            className="input input-bordered" 
            value={formData.firstName}
            onChange={(e) => updateFormData('firstName', e.target.value)}
          />
        </div>
        
        <div className="form-control">
          <label className="label">Last Name (optional)</label>
          <input 
            type="text" 
            className="input input-bordered" 
            value={formData.lastName}
            onChange={(e) => updateFormData('lastName', e.target.value)}
          />
        </div>
      </div>
      
      <div className="form-control mb-6">
        <label className="label">
          <span className="label-text">Email Address (optional)</span>
        </label>
        <input 
          type="email" 
          className="input input-bordered" 
          placeholder="you@example.com" 
          value={formData.email}
          onChange={(e) => updateFormData('email', e.target.value)}
        />
        <label className="label">
          <span className="label-text-alt">Add your email if you would like to receive your individual AI Fluency Profile as a PDF.</span>
        </label>
      </div>
      
      <div className="flex justify-between mt-8">
        <button className="btn btn-ghost" onClick={prevStep}>Previous</button>
        <button className="btn btn-primary" onClick={nextStep}>Next</button>
      </div>
    </div>
  );
}

function MindsetSectionStep({ 
  formData, 
  updateFormData, 
  prevStep, 
  nextStep 
}: { 
  formData: FormData; 
  updateFormData: (field: keyof FormData, value: any) => void; 
  prevStep: () => void; 
  nextStep: () => void; 
}) {
  const mindsetQuestions = [
    {
      number: 1,
      text: "How do you currently feel about AI in your work?",
      options: [
        "I avoid it on principle",
        "I am sceptical and prefer not to use it",
        "I am cautious but open to it",
        "I am interested and experimenting",
        "I am positive and actively using it"
      ]
    },
    {
      number: 2,
      text: "Which statement best reflects your current attitude towards AI?",
      options: [
        "It is mostly a risk",
        "It is overhyped",
        "It may be useful in some areas",
        "It is becoming important for my role",
        "It is a major opportunity if used properly"
      ]
    },
    {
      number: 3,
      text: "What is your biggest concern about AI?",
      options: [
        "I do not trust it at all",
        "It may replace jobs",
        "It is inaccurate",
        "It creates security or privacy risks",
        "I am more concerned about not knowing how to use it well"
      ]
    },
    {
      number: 4,
      text: 'How strongly do you agree: "AI will enhance many jobs more than it replaces them."',
      options: [
        "Strongly disagree",
        "Disagree",
        "Neither",
        "Agree",
        "Strongly agree"
      ]
    },
    {
      number: 5,
      text: 'How strongly do you agree: "I feel confident enough to experiment with AI."',
      options: [
        "Strongly disagree",
        "Disagree",
        "Neither",
        "Agree",
        "Strongly agree"
      ]
    },
    {
      number: 6,
      text: "Do you currently avoid using AI for any reason?",
      options: [
        "Yes, on principle",
        "Yes, because I do not trust it",
        "Yes, because I do not know how to use it properly",
        "Sometimes, depending on the task",
        "No, I use it where it makes sense"
      ]
    }
  ];
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-center">Section 1: Mindset, Attitude and Fears</h2>
      <p className="mb-6 text-center text-gray-600">About your feelings and concerns regarding AI</p>
      
      <div className="space-y-8">
        {mindsetQuestions.map((question) => (
          <div className="form-control" key={question.number}>
            <label className="label font-bold">Q{question.number}. {question.text}</label>
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <label 
                  className="flex items-center space-x-3 p-2 hover:bg-base-200 rounded-lg cursor-pointer"
                  key={index}
                >
                  <input 
                    type="radio" 
                    className="radio radio-primary" 
                    name={`q${question.number}`}
                    checked={formData[`q${question.number}` as keyof FormData] === String(index)}
                    onChange={() => updateFormData(`q${question.number}` as keyof FormData, String(index))}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        
        <div 
          className="form-control" 
          style={{ display: ['0', '1', '2', '3'].includes(formData.q6) ? 'block' : 'none' }}
        >
          <label className="label font-bold">If yes or sometimes, what is the main reason?</label>
          <textarea 
            className="textarea textarea-bordered" 
            rows={3} 
            placeholder="Please explain..." 
            value={formData.txt_reason_for_avoidance}
            onChange={(e) => updateFormData('txt_reason_for_avoidance', e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <button className="btn btn-ghost" onClick={prevStep}>Previous</button>
        <button className="btn btn-primary" onClick={nextStep}>Next</button>
      </div>
    </div>
  );
}

function UsageSectionStep({ 
  formData, 
  updateFormData, 
  updateMultiSelect, 
  prevStep, 
  nextStep 
}: { 
  formData: FormData; 
  updateFormData: (field: keyof FormData, value: any) => void; 
  updateMultiSelect: (questionNumber: string, option: string, isChecked: boolean) => void; 
  prevStep: () => void; 
  nextStep: () => void; 
}) {
  const usageQuestions = [
    {
      number: 7,
      text: "How often do you use AI tools of any kind?",
      options: [
        "Never",
        "Rarely",
        "Occasionally",
        "Weekly",
        "Daily"
      ]
    },
    {
      number: 8,
      text: "Where do you mainly use AI?",
      options: [
        "I do not use it",
        "Personal use only",
        "Mostly personal, occasionally work",
        "Mostly work, occasionally personal",
        "Regularly for both personal and work use"
      ]
    },
    {
      number: 9,
      text: "How often do you use AI for work-related tasks?",
      options: [
        "Never",
        "Rarely",
        "Occasionally",
        "Weekly",
        "Daily"
      ]
    },
    {
      number: 10,
      text: "How often do you use AI for personal tasks?",
      options: [
        "Never",
        "Rarely",
        "Occasionally",
        "Weekly",
        "Daily"
      ]
    }
  ];
  
  const multiSelectQuestions = [
    {
      number: 11,
      text: "Which main AI platforms have you used? Select all that apply.",
      options: [
        "ChatGPT",
        "Claude",
        "Gemini",
        "Microsoft Copilot",
        "Perplexity",
        "Grok",
        "Other",
        "None"
      ]
    },
    {
      number: 12,
      text: "Which additional AI tools have you used alongside the main platforms? Select all that apply.",
      options: [
        "NotebookLM",
        "Gamma",
        "Canva AI tools",
        "Fireflies",
        "Otter",
        "Midjourney",
        "Sora",
        "Zapier or Make with AI",
        "Other",
        "None"
      ]
    },
    {
      number: 13,
      text: "What do you mainly use AI for today? Select all that apply.",
      options: [
        "Basic questions or search",
        "Writing emails or messages",
        "Summarising documents",
        "Brainstorming ideas",
        "Research",
        "Content creation",
        "Planning",
        "Analysis",
        "Image generation",
        "Meeting notes",
        "I do not use it"
      ]
    }
  ];
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-center">Section 2: Usage, Frequency and Context</h2>
      <p className="mb-6 text-center text-gray-600">About how you currently use AI</p>
      
      <div className="space-y-8">
        {usageQuestions.map((question) => (
          <div className="form-control" key={question.number}>
            <label className="label font-bold">Q{question.number}. {question.text}</label>
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <label 
                  className="flex items-center space-x-3 p-2 hover:bg-base-200 rounded-lg cursor-pointer"
                  key={index}
                >
                  <input 
                    type="radio" 
                    className="radio radio-primary" 
                    name={`q${question.number}`}
                    checked={formData[`q${question.number}` as keyof FormData] === String(index)}
                    onChange={() => updateFormData(`q${question.number}` as keyof FormData, String(index))}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        
        {multiSelectQuestions.map((question) => (
          <div className="form-control" key={question.number}>
            <label className="label font-bold">Q{question.number}. {question.text}</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {question.options.map((option) => {
                const optionId = `q${question.number}_${option.replace(/[^a-zA-Z0-9]/g, '')}`;
                const isChecked = (formData[`q${question.number}` as keyof FormData] as string[]).includes(option);
                return (
                  <label 
                    className="flex items-center space-x-3 p-2 hover:bg-base-200 rounded-lg cursor-pointer"
                    key={optionId}
                  >
                    <input 
                      type="checkbox" 
                      id={optionId} 
                      className="checkbox checkbox-primary" 
                      checked={isChecked}
                      onChange={(e) => updateMultiSelect(String(question.number), option, e.target.checked)}
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
        
        <div 
          className="form-control" 
          style={{ display: formData.q11.includes('Other') || formData.q12.includes('Other') ? 'block' : 'none' }}
        >
          <label className="label font-bold">If you selected Other above, please list any other AI tools you use.</label>
          <textarea 
            className="textarea textarea-bordered" 
            rows={3} 
            placeholder="List other tools..." 
            value={formData.txt_other_tools}
            onChange={(e) => updateFormData('txt_other_tools', e.target.value)}
          />
        </div>
        
        <div className="form-control">
          <label className="label font-bold">What do you currently use AI for, if anything?</label>
          <textarea 
            className="textarea textarea-bordered" 
            rows={3} 
            placeholder="Describe your current AI usage..." 
            value={formData.txt_current_use}
            onChange={(e) => updateFormData('txt_current_use', e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <button className="btn btn-ghost" onClick={prevStep}>Previous</button>
        <button className="btn btn-primary" onClick={nextStep}>Next</button>
      </div>
    </div>
  );
}

function RemainingSectionsStep({ 
  formData, 
  updateFormData, 
  updateMultiSelect, 
  prevStep, 
  nextStep
}: { 
  formData: FormData; 
  updateFormData: (field: keyof FormData, value: any) => void; 
  updateMultiSelect: (questionNumber: string, option: string, isChecked: boolean) => void; 
  prevStep: () => void; 
  nextStep: () => void; 
}) {
  const promptingQuestions = [
    {
      number: 14,
      text: "How would you describe the way you usually prompt AI?",
      options: [
        "I ask very basic questions",
        "I give a little context",
        "I give clear instructions",
        "I structure prompts with goal, context and output",
        "I build prompts in a deliberate and repeatable way"
      ]
    },
    {
      number: 15,
      text: "When using AI, how often do you give it relevant context before asking for an answer?",
      options: [
        "Never",
        "Rarely",
        "Sometimes",
        "Often",
        "Always"
      ]
    },
    {
      number: 16,
      text: "Have you used AI to help you write or improve a prompt?",
      options: [
        "Never",
        "Tried once",
        "Occasionally",
        "Regularly",
        "This is part of my normal process"
      ]
    },
    {
      number: 17,
      text: "Have you asked AI to ask you questions before producing the final answer?",
      options: [
        "Never",
        "Rarely",
        "Sometimes",
        "Often",
        "Almost always where needed"
      ]
    },
    {
      number: 18,
      text: "When the first answer is weak, what do you usually do?",
      options: [
        "I stop using it",
        "I ask again in a similar way",
        "I make one or two changes",
        "I refine the context and instructions",
        "I iterate deliberately until the output is useful"
      ]
    },
    {
      number: 19,
      text: "How good are you at getting AI to match a tone, structure or format you want?",
      options: [
        "Not good at all",
        "Limited",
        "Fair",
        "Good",
        "Very good"
      ]
    }
  ];
  
  const researchQuestions = [
    {
      number: 20,
      text: "Have you used AI for deeper research rather than just quick answers?",
      options: [
        "Never",
        "Rarely",
        "Sometimes",
        "Often",
        "Regularly for structured research tasks"
      ]
    },
    {
      number: 21,
      text: "Have you used a deep research function within an AI platform?",
      options: [
        "No, never",
        "I have heard of it but not used it",
        "Tried once or twice",
        "Used it a few times",
        "Use it confidently where appropriate"
      ]
    },
    {
      number: 22,
      text: "How often do you check or verify AI outputs before using them in important work?",
      options: [
        "Never",
        "Rarely",
        "Sometimes",
        "Often",
        "Always"
      ]
    },
    {
      number: 23,
      text: "Have you compared outputs across more than one AI platform?",
      options: [
        "Never",
        "Tried once",
        "Occasionally",
        "Regularly",
        "I deliberately use different tools for different strengths"
      ]
    }
  ];
  
  const workflowQuestions = [
    {
      number: 24,
      text: "Have you used Projects, custom GPTs, Gems, or similar AI workspaces?",
      options: [
        "Never",
        "I have heard of them but not used them",
        "Tried once or twice",
        "Used them a few times",
        "Use them regularly for defined purposes"
      ]
    },
    {
      number: 25,
      text: "If you have used Projects, custom GPTs, Gems, or similar, how advanced was your setup?",
      options: [
        "I have not used them",
        "Used defaults only",
        "Added a custom prompt or instruction",
        "Added a custom prompt plus files or knowledge",
        "Built a bespoke setup for a repeated task or workflow"
      ]
    }
  ];
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-center">Sections 3-5: Skills and Workflow</h2>
      <p className="mb-6 text-center text-gray-600">About your prompting skills, research practices, and workflow maturity</p>
      
      <div className="space-y-8">
        {/* Section 3: Prompting */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-xl font-semibold mb-4">Section 3: Prompting and Core Skill</h3>
          
          {promptingQuestions.map((question) => (
            <div className="form-control" key={question.number}>
              <label className="label font-bold">Q{question.number}. {question.text}</label>
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <label 
                    className="flex items-center space-x-3 p-2 hover:bg-base-200 rounded-lg cursor-pointer"
                    key={index}
                  >
                    <input 
                      type="radio" 
                      className="radio radio-primary" 
                      name={`q${question.number}`}
                      checked={formData[`q${question.number}` as keyof FormData] === String(index)}
                      onChange={() => updateFormData(`q${question.number}` as keyof FormData, String(index))}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Section 4: Research */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-xl font-semibold mb-4">Section 4: Research, Judgement and Quality of Use</h3>
          
          {researchQuestions.map((question) => (
            <div className="form-control" key={question.number}>
              <label className="label font-bold">Q{question.number}. {question.text}</label>
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <label 
                    className="flex items-center space-x-3 p-2 hover:bg-base-200 rounded-lg cursor-pointer"
                    key={index}
                  >
                    <input 
                      type="radio" 
                      className="radio radio-primary" 
                      name={`q${question.number}`}
                      checked={formData[`q${question.number}` as keyof FormData] === String(index)}
                      onChange={() => updateFormData(`q${question.number}` as keyof FormData, String(index))}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Section 5: Workflow */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Section 5: Projects, Customisation and Workflow Maturity</h3>
          
          {workflowQuestions.map((question) => (
            <div className="form-control" key={question.number}>
              <label className="label font-bold">Q{question.number}. {question.text}</label>
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <label 
                    className="flex items-center space-x-3 p-2 hover:bg-base-200 rounded-lg cursor-pointer"
                    key={index}
                  >
                    <input 
                      type="radio" 
                      className="radio radio-primary" 
                      name={`q${question.number}`}
                      checked={formData[`q${question.number}` as keyof FormData] === String(index)}
                      onChange={() => updateFormData(`q${question.number}` as keyof FormData, String(index))}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <button className="btn btn-ghost" onClick={prevStep}>Previous</button>
        <button className="btn btn-primary" onClick={nextStep}>Next</button>
      </div>
    </div>
  );
}

function FinalQuestionsStep({
  formData,
  updateFormData,
  prevStep,
  submitAssessment
}: {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
  prevStep: () => void;
  submitAssessment: () => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-center">Final Questions</h2>
      <p className="mb-6 text-center text-gray-600">A few closing questions to help tailor the training.</p>

      <div className="space-y-6">
        <div className="form-control">
          <label className="label font-bold">What would you most like AI training to help you with?</label>
          <textarea
            className="textarea textarea-bordered"
            rows={3}
            placeholder="Describe your training needs..."
            value={formData.txt_training_help}
            onChange={(e) => updateFormData('txt_training_help', e.target.value)}
          />
        </div>

        <div className="form-control">
          <label className="label font-bold">Do you have any specific questions you would like the training to cover?</label>
          <textarea
            className="textarea textarea-bordered"
            rows={3}
            placeholder="List your questions..."
            value={formData.txt_specific_training_questions}
            onChange={(e) => updateFormData('txt_specific_training_questions', e.target.value)}
          />
        </div>

        <div className="form-control">
          <label className="label font-bold">Any other comments about AI, your role, or your current experience?</label>
          <textarea
            className="textarea textarea-bordered"
            rows={3}
            placeholder="Share any additional thoughts..."
            value={formData.txt_other_comments}
            onChange={(e) => updateFormData('txt_other_comments', e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button className="btn btn-ghost" onClick={prevStep}>Previous</button>
        <button className="btn btn-primary" onClick={submitAssessment}>Submit Assessment</button>
      </div>
    </div>
  );
}

function CompletionStep({ formData }: { formData: FormData }) {
  return (
    <div className="text-center">
      <div className="text-primary mb-6 flex justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
      <p className="mb-4">Your responses have been recorded.</p>
      <p className="mb-6">These insights will help shape the training.</p>
      <p>You may also find our AI articles useful while you wait for the session.</p>
      
      <div className="mt-8 bg-base-200 p-6 rounded-lg text-left max-w-2xl mx-auto">
        <h3 className="font-bold text-lg mb-4">Submission Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="font-medium">Group:</span> {formData.groupName}</div>
          {formData.subgroupName && <div><span className="font-medium">Subgroup:</span> {formData.subgroupName}</div>}
          <div><span className="font-medium">Identity Mode:</span> {formData.identityMode === 'named' ? 'Named' : 'Anonymised'}</div>
          {(formData.firstName || formData.lastName) && 
            <div><span className="font-medium">Name:</span> {formData.firstName} {formData.lastName}</div>}
          {formData.email && <div><span className="font-medium">Email:</span> {formData.email}</div>}
        </div>
      </div>
    </div>
  );
}
