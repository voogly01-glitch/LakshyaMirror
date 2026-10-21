export type ExamTier = 'national' | 'international' | 'state' | 'district';

export type ExamStream = 
  | 'medical' 
  | 'nursing' 
  | 'civil_services' 
  | 'engineering' 
  | 'defense' 
  | 'banking_ssc'
  | 'state_services';

export type TopicStatus = 'not_started' | 'in_progress' | 'completed' | 'review_later';

export type MistakeTag = 'conceptual' | 'calculation' | 'silly' | 'time_pressure' | 'guesswork' | 'misread';

export interface ExamTopic {
  id: string;
  name: string;
  estimatedHours: number;
  priority: 'high' | 'medium' | 'low';
  theoryRead: boolean;
  notesMade: boolean;
  revisionDone: boolean;
  status: TopicStatus;
  bookmarked: boolean;
  completedAt?: string;
  notes?: string;
}

export interface ExamChapter {
  id: string;
  name: string;
  weightage: 'high' | 'medium' | 'low';
  topics: ExamTopic[];
}

export interface ExamSubject {
  id: string;
  name: string;
  iconName?: string;
  color?: string;
  chapters: ExamChapter[];
}

export interface MarkingScheme {
  correct: number;
  incorrectPenalty: number; // e.g. 1 for -1, 0.33 for -0.33, 0.25 for -0.25
  unattempted: number;
}

export interface Question {
  id: string;
  examId: string;
  subjectId: string;
  chapterId: string;
  topicId?: string;
  type: 'practice' | 'mock' | 'pyq' | 'major';
  pyqYear?: number;
  text: string;
  imageUrl?: string;
  imageAlt?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  suggestedMistakeTag?: MistakeTag;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TestAnswerRecord {
  questionId: string;
  selectedOption: number | null;
  isCorrect: boolean;
  timeTakenSec: number;
  mistakeTag?: MistakeTag;
  userNote?: string;
  bookmarked?: boolean;
}

export interface TestAttempt {
  id: string;
  testTitle: string;
  testType: 'practice' | 'mock' | 'pyq' | 'major';
  examId: string;
  examName: string;
  subjectId?: string;
  chapterId?: string;
  topicId?: string;
  timestamp: number;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  positiveMarks: number;
  negativeMarks: number;
  netScore: number;
  maxScore: number;
  percentage: number;
  accuracy: number;
  timeSpentSeconds: number;
  answers: TestAnswerRecord[];
}

export interface Exam {
  id: string;
  name: string;
  tier: ExamTier;
  stream: ExamStream;
  state?: string;
  district?: string;
  tagline: string;
  markingScheme: MarkingScheme;
  targetExamDate: string;
  targetScore: number;
  totalMarks: number;
  durationMinutes: number;
  subjects: ExamSubject[];
}

export interface StudentProfile {
  name: string;
  email: string;
  currentExamId: string;
  dailyGoalHours: number;
  dailyGoalQuestions: number;
  todayStudyMinutes: number;
  todayQuestionsSolved: number;
  streakDays: number;
  lastActiveDate: string;
  targetRank: number;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  location: string;
  syllabusCompletion: number;
  averageAccuracy: number;
  testsCompleted: number;
  majorTestScore: number;
  isCurrentUser?: boolean;
}
