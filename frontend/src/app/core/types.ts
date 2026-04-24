export type Role = 'candidate' | 'recruiter' | 'admin';

export interface AuthUser {
  id: number;
  email: string;
  role: Role;
  createdAt: string;
}

export interface CandidateProfile {
  id: number;
  userId: number;
  fullName: string;
  headline: string;
  location: string;
  bio: string;
  skills: string[];
  updatedAt: string;
}

export interface Job {
  id: number;
  recruiterId: number;
  title: string;
  company: string;
  location: string;
  employmentType: string;
  salaryRange: string;
  description: string;
  requiredSkills: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface MatchResult {
  job: Job;
  score: number;
  reasons: string[];
  gaps: string[];
}

export interface Application {
  id: number;
  jobId: number;
  candidateUserId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  history: Array<{ at: string; status: string; note: string }>;
  job?: Job;
}

export interface ChatMessage {
  id: number;
  sessionId: number;
  sender: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface InterviewSession {
  id: number;
  userId: number;
  roleTarget: string;
  levelTarget: string;
  questions: string[];
  answers: Array<{ questionIndex: number; answer: string }>;
  feedback: {
    score: number;
    summary: string;
    strengths: string[];
    improvements: string[];
  } | null;
  createdAt: string;
  updatedAt: string;
}
