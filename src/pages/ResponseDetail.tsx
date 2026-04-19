import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Types
type ResponseDetail = {
  id: number;
  response_id: string;
  group_id: string;
  group_name: string;
  subgroup_id: string;
  subgroup_name: string;
  identity_mode: string;
  trainer_can_identify: boolean;
  visible_to_group_lead_as_individual: boolean;
  include_in_team_aggregate: boolean;
  first_name: string;
  last_name: string;
  email: string;
  email_provided: boolean;
  submission_datetime: string;
  assessment_version: string;
  consent_text_shown: string;
  mindset_profile_value: number | null;
  usage_profile_value: number | null;
  prompting_profile_value: number | null;
  research_profile_value: number | null;
  workflow_profile_value: number | null;
  overall_profile_value: number | null;
  mindset_band: string;
  usage_band: string;
  prompting_band: string;
  research_band: string;
  workflow_band: string;
  overall_fluency_band: string;
  primary_gap: string;
  primary_strength: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
  q7: string;
  q8: string;
  q9: string;
  q10: string;
  q11: string[];
  q12: string[];
  q13: string[];
  q14: string;
  q15: string;
  q16: string;
  q17: string;
  q18: string;
  q19: string;
  q20: string;
  q21: string;
  q22: string;
  q23: string;
  q24: string;
  q25: string;
  txt_reason_for_avoidance: string;
  txt_other_tools: string;
  txt_current_use: string;
  txt_training_help: string;
  txt_specific_training_questions: string;
  txt_other_comments: string;
  pdf_generated: boolean;
  pdf_sent: boolean;
  pdf_file_link: string;
  notes: string;
};

export function ResponseDetail() {
  const { id } = useParams<{ id: string }>();
  const [response, setResponse] = useState<ResponseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  
  // Fetch response detail
  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const res = await axios.get<ResponseDetail>(`/api/ai/results/${id}`);
        setResponse(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching response detail:', err);
        setError('Failed to load response detail. Please try again later.');
        setLoading(false);
      }
    };
    
    if (id) {
      fetchResponse();
    }
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }
  
  if (!response) {
    return (
      <div className="text-center py-8">
        <p>Response not found.</p>
      </div>
    );
  }
  
  // Map question numbers to text
  const questionTexts: Record<string, string> = {
    q1: "How do you currently feel about AI in your work?",
    q2: "Which statement best reflects your current attitude towards AI?",
    q3: "What is your biggest concern about AI?",
    q4: "How strongly do you agree: \"AI will enhance many jobs more than it replaces them.\"",
    q5: "How strongly do you agree: \"I feel confident enough to experiment with AI.\"",
    q6: "Do you currently avoid using AI for any reason?",
    q7: "How often do you use AI tools of any kind?",
    q8: "Where do you mainly use AI?",
    q9: "How often do you use AI for work-related tasks?",
    q10: "How often do you use AI for personal tasks?",
    q11: "Which main AI platforms have you used? Select all that apply.",
    q12: "Which additional AI tools have you used alongside the main platforms? Select all that apply.",
    q13: "What do you mainly use AI for today? Select all that apply.",
    q14: "How would you describe the way you usually prompt AI?",
    q15: "When using AI, how often do you give it relevant context before asking for an answer?",
    q16: "Have you used AI to help you write or improve a prompt?",
    q17: "Have you asked AI to ask you questions before producing the final answer?",
    q18: "When the first answer is weak, what do you usually do?",
    q19: "How good are you at getting AI to match a tone, structure or format you want?",
    q20: "Have you used AI for deeper research rather than just quick answers?",
    q21: "Have you used a deep research function within an AI platform?",
    q22: "How often do you check or verify AI outputs before using them in important work?",
    q23: "Have you compared outputs across more than one AI platform?",
    q24: "Have you used Projects, custom GPTs, Gems, or similar AI workspaces?",
    q25: "If you have used Projects, custom GPTs, Gems, or similar, how advanced was your setup?"
  };
  
  // Map answer indices to text for single choice questions
  const answerOptions: Record<string, string[]> = {
    q1: [
      "I avoid it on principle",
      "I am sceptical and prefer not to use it",
      "I am cautious but open to it",
      "I am interested and experimenting",
      "I am positive and actively using it"
    ],
    q2: [
      "It is mostly a risk",
      "It is overhyped",
      "It may be useful in some areas",
      "It is becoming important for my role",
      "It is a major opportunity if used properly"
    ],
    q3: [
      "I do not trust it at all",
      "It may replace jobs",
      "It is inaccurate",
      "It creates security or privacy risks",
      "I am more concerned about not knowing how to use it well"
    ],
    q4: [
      "Strongly disagree",
      "Disagree",
      "Neither",
      "Agree",
      "Strongly agree"
    ],
    q5: [
      "Strongly disagree",
      "Disagree",
      "Neither",
      "Agree",
      "Strongly agree"
    ],
    q6: [
      "Yes, on principle",
      "Yes, because I do not trust it",
      "Yes, because I do not know how to use it properly",
      "Sometimes, depending on the task",
      "No, I use it where it makes sense"
    ],
    q7: [
      "Never",
      "Rarely",
      "Occasionally",
      "Weekly",
      "Daily"
    ],
    q8: [
      "I do not use it",
      "Personal use only",
      "Mostly personal, occasionally work",
      "Mostly work, occasionally personal",
      "Regularly for both personal and work use"
    ],
    q9: [
      "Never",
      "Rarely",
      "Occasionally",
      "Weekly",
      "Daily"
    ],
    q10: [
      "Never",
      "Rarely",
      "Occasionally",
      "Weekly",
      "Daily"
    ],
    q14: [
      "I ask very basic questions",
      "I give a little context",
      "I give clear instructions",
      "I structure prompts with goal, context and output",
      "I build prompts in a deliberate and repeatable way"
    ],
    q15: [
      "Never",
      "Rarely",
      "Sometimes",
      "Often",
      "Always"
    ],
    q16: [
      "Never",
      "Tried once",
      "Occasionally",
      "Regularly",
      "This is part of my normal process"
    ],
    q17: [
      "Never",
      "Rarely",
      "Sometimes",
      "Often",
      "Almost always where needed"
    ],
    q18: [
      "I stop using it",
      "I ask again in a similar way",
      "I make one or two changes",
      "I refine the context and instructions",
      "I iterate deliberately until the output is useful"
    ],
    q19: [
      "Not good at all",
      "Limited",
      "Fair",
      "Good",
      "Very good"
    ],
    q20: [
      "Never",
      "Rarely",
      "Sometimes",
      "Often",
      "Regularly for structured research tasks"
    ],
    q21: [
      "No, never",
      "I have heard of it but not used it",
      "Tried once or twice",
      "Used it a few times",
      "Use it confidently where appropriate"
    ],
    q22: [
      "Never",
      "Rarely",
      "Sometimes",
      "Often",
      "Always"
    ],
    q23: [
      "Never",
      "Tried once",
      "Occasionally",
      "Regularly",
      "I deliberately use different tools for different strengths"
    ],
    q24: [
      "Never",
      "I have heard of them but not used them",
      "Tried once or twice",
      "Used them a few times",
      "Use them regularly for defined purposes"
    ],
    q25: [
      "I have not used them",
      "Used defaults only",
      "Added a custom prompt or instruction",
      "Added a custom prompt plus files or knowledge",
      "Built a bespoke setup for a repeated task or workflow"
    ]
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Response Detail</h2>
        <button 
          className="btn btn-ghost" 
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
      
      {/* Response Summary */}
      <div className="card bg-base-100 shadow-md mb-8">
        <div className="card-body">
          <h3 className="card-title">Response Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><span className="font-medium">Submitted:</span> {new Date(response.submission_datetime).toLocaleString()}</div>
            <div><span className="font-medium">Group:</span> {response.group_name}</div>
            {response.subgroup_name && <div><span className="font-medium">Subgroup:</span> {response.subgroup_name}</div>}
            <div><span className="font-medium">Identity Mode:</span> {response.identity_mode === 'named' ? 'Named' : 'Anonymised'}</div>
            {(response.first_name || response.last_name) && 
              <div><span className="font-medium">Name:</span> {response.first_name} {response.last_name}</div>}
            {response.email && <div><span className="font-medium">Email:</span> {response.email}</div>}
          </div>
          
          {/* Profile Scores */}
          <div className="mt-6">
            <h4 className="font-bold mb-2">Profile Scores</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="stat bg-base-200 rounded-box">
                <div className="stat-title">Mindset</div>
                <div className="stat-value text-primary">{response.mindset_profile_value ? response.mindset_profile_value.toFixed(1) : 'N/A'}</div>
                <div className="stat-desc">{response.mindset_band || 'N/A'}</div>
              </div>
              
              <div className="stat bg-base-200 rounded-box">
                <div className="stat-title">Usage</div>
                <div className="stat-value text-primary">{response.usage_profile_value ? response.usage_profile_value.toFixed(1) : 'N/A'}</div>
                <div className="stat-desc">{response.usage_band || 'N/A'}</div>
              </div>
              
              <div className="stat bg-base-200 rounded-box">
                <div className="stat-title">Prompting</div>
                <div className="stat-value text-primary">{response.prompting_profile_value ? response.prompting_profile_value.toFixed(1) : 'N/A'}</div>
                <div className="stat-desc">{response.prompting_band || 'N/A'}</div>
              </div>
              
              <div className="stat bg-base-200 rounded-box">
                <div className="stat-title">Research</div>
                <div className="stat-value text-primary">{response.research_profile_value ? response.research_profile_value.toFixed(1) : 'N/A'}</div>
                <div className="stat-desc">{response.research_band || 'N/A'}</div>
              </div>
              
              <div className="stat bg-base-200 rounded-box">
                <div className="stat-title">Workflow</div>
                <div className="stat-value text-primary">{response.workflow_profile_value ? response.workflow_profile_value.toFixed(1) : 'N/A'}</div>
                <div className="stat-desc">{response.workflow_band || 'N/A'}</div>
              </div>
              
              <div className="stat bg-base-200 rounded-box">
                <div className="stat-title">Overall</div>
                <div className="stat-value text-primary">{response.overall_profile_value ? response.overall_profile_value.toFixed(1) : 'N/A'}</div>
                <div className="stat-desc">{response.overall_fluency_band || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Answers Section */}
      <div className="card bg-base-100 shadow-md mb-8">
        <div className="card-body">
          <h3 className="card-title">Answers</h3>
          
          <div className="space-y-6">
            {/* Single Choice Questions */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25].map(num => {
              const questionKey = `q${num}` as keyof ResponseDetail;
              const answerIndex = response[questionKey] as string;
              const answerText = answerOptions[questionKey]?.[parseInt(answerIndex)] || 'Not answered';
              
              return (
                <div key={num} className="border-b border-base-300 pb-4 last:border-0 last:pb-0">
                  <h4 className="font-medium mb-1">Q{num}. {questionTexts[questionKey]}</h4>
                  <p className="pl-4">{answerText}</p>
                </div>
              );
            })}
            
            {/* Multi Choice Questions */}
            {[11, 12, 13].map(num => {
              const questionKey = `q${num}` as keyof ResponseDetail;
              const answers = response[questionKey] as string[];
              
              return (
                <div key={num} className="border-b border-base-300 pb-4 last:border-0 last:pb-0">
                  <h4 className="font-medium mb-1">Q{num}. {questionTexts[questionKey]}</h4>
                  <ul className="list-disc pl-8">
                    {answers.map((answer, index) => (
                      <li key={index}>{answer}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
            
            {/* Text Questions */}
            {[
              { key: 'txt_reason_for_avoidance', label: 'Reason for avoidance' },
              { key: 'txt_other_tools', label: 'Other tools used' },
              { key: 'txt_current_use', label: 'Current AI usage' },
              { key: 'txt_training_help', label: 'Training help needed' },
              { key: 'txt_specific_training_questions', label: 'Specific training questions' },
              { key: 'txt_other_comments', label: 'Other comments' }
            ].map(({ key, label }) => {
              const textValue = response[key as keyof ResponseDetail] as string;
              
              return textValue ? (
                <div key={key} className="border-b border-base-300 pb-4 last:border-0 last:pb-0">
                  <h4 className="font-medium mb-1">{label}</h4>
                  <p className="pl-4 whitespace-pre-wrap">{textValue}</p>
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}