// Utility functions for calculating profile values

export const calculateProfileValues = (answers) => {
  // Calculate mindset profile value (Q1-Q6)
  const mindsetQuestions = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'];
  const mindsetScore = calculateSectionScore(mindsetQuestions, answers);
  
  // Calculate usage profile value (Q7-Q13)
  const usageQuestions = ['q7', 'q8', 'q9', 'q10'];
  const usageScore = calculateSectionScore(usageQuestions, answers);
  
  // Handle multi-select questions for usage (Q11-Q13)
  const usageMultiSelectScore = calculateMultiSelectScore(['q11', 'q12', 'q13'], answers);
  
  // Calculate prompting profile value (Q14-Q19)
  const promptingQuestions = ['q14', 'q15', 'q16', 'q17', 'q18', 'q19'];
  const promptingScore = calculateSectionScore(promptingQuestions, answers);
  
  // Calculate research profile value (Q20-Q23)
  const researchQuestions = ['q20', 'q21', 'q22', 'q23'];
  const researchScore = calculateSectionScore(researchQuestions, answers);
  
  // Calculate workflow profile value (Q24-Q25)
  const workflowQuestions = ['q24', 'q25'];
  const workflowScore = calculateSectionScore(workflowQuestions, answers);
  
  // Calculate overall profile value
  const overallScore = Math.round(
    (mindsetScore + usageScore + usageMultiSelectScore + promptingScore + researchScore + workflowScore) / 6
  );
  
  // Determine bands (0-4 scale)
  const getBand = (score) => {
    if (score === 0) return 'Novice';
    if (score <= 1) return 'Beginner';
    if (score <= 2) return 'Intermediate';
    if (score <= 3) return 'Advanced';
    return 'Expert';
  };
  
  return {
    mindset_profile_value: parseFloat(mindsetScore.toFixed(2)),
    usage_profile_value: parseFloat((usageScore + usageMultiSelectScore).toFixed(2)),
    prompting_profile_value: parseFloat(promptingScore.toFixed(2)),
    research_profile_value: parseFloat(researchScore.toFixed(2)),
    workflow_profile_value: parseFloat(workflowScore.toFixed(2)),
    overall_profile_value: parseFloat(overallScore.toFixed(2)),
    
    mindset_band: getBand(mindsetScore),
    usage_band: getBand(usageScore + usageMultiSelectScore),
    prompting_band: getBand(promptingScore),
    research_band: getBand(researchScore),
    workflow_band: getBand(workflowScore),
    overall_fluency_band: getBand(overallScore)
  };
};

// Calculate score for single select questions
const calculateSectionScore = (questions, answers) => {
  let total = 0;
  let count = 0;
  
  questions.forEach(q => {
    if (answers[q] !== undefined && answers[q] !== null && answers[q] !== '') {
      total += parseInt(answers[q]);
      count++;
    }
  });
  
  return count > 0 ? total / count : 0; // Return average score
};

// Calculate score for multi-select questions
const calculateMultiSelectScore = (questions, answers) => {
  let totalScore = 0;
  let questionCount = 0;
  
  questions.forEach(q => {
    if (answers[q] && Array.isArray(answers[q])) {
      questionCount++;
      // Count the number of selected options
      const count = answers[q].length;
      
      // Apply scoring logic:
      // none = 0
      // 1 relevant item = 1
      // 2-3 relevant items = 2
      // 4-5 relevant items = 3
      // 6+ relevant items = 4
      if (count === 0) {
        totalScore += 0;
      } else if (count === 1) {
        totalScore += 1;
      } else if (count <= 3) {
        totalScore += 2;
      } else if (count <= 5) {
        totalScore += 3;
      } else {
        totalScore += 4;
      }
    }
  });
  
  // Return average score across multi-select questions
  return questionCount > 0 ? totalScore / questionCount : 0;
};

// Function to determine anonymization flags
export const getAnonymizationFlags = (identityMode) => {
  const isNamed = identityMode === 'named';
  
  return {
    identity_mode: identityMode,
    trainer_can_identify: true, // Trainers can always identify
    visible_to_group_lead_as_individual: isNamed, // Visible to group lead only if named
    include_in_team_aggregate: true // Always included in aggregates
  };
};

// Function to determine primary gap and strength
export const getProfileInsights = (profileValues) => {
  const sections = [
    { name: 'Mindset', value: profileValues.mindset_profile_value },
    { name: 'Usage', value: profileValues.usage_profile_value },
    { name: 'Prompting', value: profileValues.prompting_profile_value },
    { name: 'Research', value: profileValues.research_profile_value },
    { name: 'Workflow', value: profileValues.workflow_profile_value }
  ];
  
  // Find the section with the lowest score (primary gap)
  const primaryGap = sections.reduce((min, section) => 
    section.value < min.value ? section : min
  );
  
  // Find the section with the highest score (primary strength)
  const primaryStrength = sections.reduce((max, section) => 
    section.value > max.value ? section : max
  );
  
  return {
    primary_gap: primaryGap.name,
    primary_strength: primaryStrength.name
  };
};