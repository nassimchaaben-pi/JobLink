import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Application, CandidateProfile, InterviewSession, Job, MatchResult, AuthUser, ChatMessage } from './types';

interface AssistantChatResponse {
  session: { id: number; userId: number; createdAt: string; updatedAt: string };
  messages: ChatMessage[];
}

interface AdminMetrics {
  usersCount: number;
  candidateProfilesCount: number;
  jobsCount: number;
  applicationsCount: number;
  interviewSessionsCount: number;
  chatMessagesCount: number;
}

@Injectable({ providedIn: 'root' })
export class JobApiService {
  constructor(private readonly api: ApiService) {}

  listPublicJobs(query?: { status?: string; q?: string }): Observable<{ jobs: Job[] }> {
    const params = new URLSearchParams();
    if (query?.status) {
      params.set('status', query.status);
    }
    if (query?.q) {
      params.set('q', query.q);
    }

    const suffix = params.toString() ? `?${params.toString()}` : '';
    return this.api.get(`/jobs${suffix}`);
  }

  getJob(jobId: number): Observable<{ job: Job }> {
    return this.api.get(`/jobs/${jobId}`);
  }

  createRecruiterJob(payload: Partial<Job>): Observable<{ job: Job }> {
    return this.api.post('/jobs/recruiter', payload, true);
  }

  updateRecruiterJob(jobId: number, payload: Partial<Job>): Observable<{ job: Job }> {
    return this.api.put(`/jobs/recruiter/${jobId}`, payload, true);
  }

  listRecruiterJobs(): Observable<{ jobs: Job[] }> {
    return this.api.get('/jobs/recruiter/mine', true);
  }

  listCandidateApplications(): Observable<{ applications: Application[] }> {
    return this.api.get('/jobs/candidate/applications/me', true);
  }

  applyToJob(jobId: number): Observable<{ application: Application }> {
    return this.api.post(`/jobs/${jobId}/apply`, {}, true);
  }

  updateApplicationStatus(applicationId: number, status: string, note = ''): Observable<{ application: Application }> {
    return this.api.patch(`/jobs/applications/${applicationId}/status`, { status, note }, true);
  }

  listJobApplicationsForRecruiter(jobId: number): Observable<{ applications: Application[] }> {
    return this.api.get(`/jobs/recruiter/${jobId}/applications`, true);
  }

  getCandidateMatches(): Observable<{ matches: MatchResult[] }> {
    return this.api.get('/ai/matches/me', true);
  }

  getMyProfile(): Observable<{ profile: CandidateProfile }> {
    return this.api.get('/profiles/me', true);
  }

  updateMyProfile(payload: Partial<CandidateProfile>): Observable<{ profile: CandidateProfile }> {
    return this.api.put('/profiles/me', payload, true);
  }

  assistantChat(message: string): Observable<AssistantChatResponse> {
    return this.api.post('/ai/assistant/chat', { message }, true);
  }

  createInterviewSession(payload: { roleTarget: string; levelTarget: string }): Observable<{ session: InterviewSession }> {
    return this.api.post('/ai/interview/sessions', payload, true);
  }

  submitInterviewAnswer(sessionId: number, questionIndex: number, answer: string): Observable<{ session: InterviewSession }> {
    return this.api.post(`/ai/interview/sessions/${sessionId}/answer`, { questionIndex, answer }, true);
  }

  getInterviewFeedback(sessionId: number): Observable<{ feedback: InterviewSession['feedback'] }> {
    return this.api.get(`/ai/interview/sessions/${sessionId}/feedback`, true);
  }

  getAdminMetrics(): Observable<{ metrics: AdminMetrics }> {
    return this.api.get('/admin/metrics', true);
  }

  listAdminUsers(): Observable<{ users: AuthUser[] }> {
    return this.api.get('/admin/users', true);
  }

  listPublicJobsLegacy(): Observable<{ jobs: unknown[] }> {
    return this.api.get('/jobs');
  }
}
