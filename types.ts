export interface SurveyData {
  id: string;
  timestamp: string;
  // Background
  name: string;
  age: string;
  gender: string;
  jobTitle: string;
  joinYear: string;
  hasIDA: string;
  // Questions 1-10
  q1_brandDefinition: string;
  q2_favoriteBrand: string;
  q3_whyFavorite: string;
  q4_knowledgeExpectation: string;
  q5_hasCopywritingExp: string;
  q6_expDetail: string;
  q7_knowVictor: string;
  q8_victorImpression: string;
  q9_acceptWork: string;
  q10_wishes: string;
}

export interface QuestionAnalysis {
  questionId: number;
  questionText: string;
  summary: string;
}

export interface FullAnalysis {
  perQuestionAnalysis: QuestionAnalysis[];
  overallAdvice: string;
  studentPersona: string;
}
