import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { JobApiService } from '../../core/job-api.service';
import { AuthStateService } from '../../core/auth-state.service';
import { FormsModule } from '@angular/forms';
import { Application, CandidateProfile, InterviewSession, Job, MatchResult } from '../../core/types';

@Component({
  selector: 'app-candidate-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './candidate-dashboard.component.html',
  styleUrl: './candidate-dashboard.component.scss'
})
export class CandidateDashboardComponent implements OnInit {
  protected loading = false;
  protected profile: CandidateProfile | null = null;
  protected applications: Application[] = [];
  protected matches: MatchResult[] = [];
  protected jobs: Job[] = [];
  protected filteredJobs: Job[] = [];
  protected searchTerm = '';
  protected errorMessage = '';
  protected successMessage = '';
  protected readonly email: string;
  protected profileForm = {
    fullName: '',
    headline: '',
    location: '',
    bio: '',
    skillsInput: ''
  };

  protected chatInput = '';
  protected chatHistory: Array<{ sender: 'user' | 'assistant'; content: string }> = [];
  protected interviewSession: InterviewSession | null = null;
  protected interviewAnswer = '';
  protected interviewQuestionIndex = 0;
  protected interviewFeedback: InterviewSession['feedback'] | null = null;
  protected readonly heroImage =
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80';
  protected readonly coachImage =
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80';
  protected readonly quickStats = [
    { label: 'Profile strength', value: '84%', trend: '+6% this week' },
    { label: 'Interview readiness', value: '72%', trend: '2 mock sessions left' },
    { label: 'New matches', value: '18', trend: 'Top 5 updated today' },
    { label: 'Applications sent', value: '7', trend: '3 in review' }
  ];
  protected readonly learningPlan = [
    'Refine STAR answers for behavioral questions',
    'Add one quantified project result to CV',
    'Practice concise self-introduction (45 sec)'
  ];

  constructor(
    private readonly api: JobApiService,
    authState: AuthStateService
  ) {
    this.email = authState.getEmail();
  }

  ngOnInit(): void {
    this.seedInstantDashboardData();
    void this.loadData();
  }

  private seedInstantDashboardData(): void {
    this.profile = {
      id: 0,
      userId: 0,
      fullName: 'Aya Ben Salah',
      headline: 'Junior Frontend Engineer',
      location: 'Tunis, Tunisia',
      bio: 'Curious engineer focused on clean UI and product-driven development.',
      skills: ['angular', 'typescript', 'css', 'ux basics'],
      updatedAt: new Date().toISOString()
    };

    this.profileForm = {
      fullName: this.profile.fullName,
      headline: this.profile.headline,
      location: this.profile.location,
      bio: this.profile.bio,
      skillsInput: ''
    };

    this.jobs = [
      {
        id: 101,
        recruiterId: 0,
        title: 'Frontend Engineer Graduate Track',
        company: 'NovaTech Labs',
        location: 'Remote Europe',
        employmentType: 'full-time',
        salaryRange: 'EUR 42k - 56k',
        description: 'Own responsive Angular interfaces and collaborate with product and design.',
        requiredSkills: ['angular', 'typescript', 'testing'],
        status: 'published',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 102,
        recruiterId: 0,
        title: 'Product Design Intern',
        company: 'Pulse AI',
        location: 'Berlin Hybrid',
        employmentType: 'internship',
        salaryRange: 'EUR 1.4k / month',
        description: 'Design onboarding flows and contribute to design system evolution.',
        requiredSkills: ['figma', 'ui', 'prototype'],
        status: 'published',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 103,
        recruiterId: 0,
        title: 'Junior Data Analyst',
        company: 'Northwind Insights',
        location: 'Paris Onsite',
        employmentType: 'full-time',
        salaryRange: 'EUR 38k - 48k',
        description: 'Turn acquisition data into actionable dashboards for growth teams.',
        requiredSkills: ['sql', 'excel', 'python'],
        status: 'published',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    this.filteredJobs = [...this.jobs];
    this.matches = [
      {
        job: this.jobs[0],
        score: 91,
        reasons: ['Strong Angular alignment', 'Portfolio projects match responsibilities'],
        gaps: ['Automated testing depth']
      },
      {
        job: this.jobs[2],
        score: 68,
        reasons: ['Good analytical mindset', 'Strong presentation quality'],
        gaps: ['Advanced SQL', 'Python data stack']
      }
    ];
    this.applications = [
      {
        id: 9001,
        jobId: 101,
        candidateUserId: 0,
        status: 'screening',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        history: [{ at: new Date().toISOString(), status: 'screening', note: 'Recruiter reviewed profile' }],
        job: this.jobs[0]
      }
    ];
    this.chatHistory = [
      {
        sender: 'assistant',
        content: 'Welcome back. I suggest improving testing examples before your next interview.'
      }
    ];
  }

  private withTimeout<T>(promise: Promise<T>, label: string, timeoutMs = 3500): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        setTimeout(() => reject(new Error(`${label} request timed out`)), timeoutMs);
      })
    ]);
  }

  private async loadData(): Promise<void> {
    this.loading = true;
    try {
      const [profile, applications, matches, jobs] = await Promise.allSettled([
        this.withTimeout(firstValueFrom(this.api.getMyProfile()), 'profile'),
        this.withTimeout(firstValueFrom(this.api.listCandidateApplications()), 'applications'),
        this.withTimeout(firstValueFrom(this.api.getCandidateMatches()), 'matches'),
        this.withTimeout(firstValueFrom(this.api.listPublicJobs({ status: 'published' })), 'jobs')
      ]);

      if (profile.status === 'fulfilled') {
        this.profile = profile.value.profile;
        this.profileForm = {
          fullName: this.profile.fullName || '',
          headline: this.profile.headline || '',
          location: this.profile.location || '',
          bio: this.profile.bio || '',
          skillsInput: (this.profile.skills || []).join(', ')
        };
      }

      if (applications.status === 'fulfilled') {
        this.applications = applications.value.applications;
      }

      if (matches.status === 'fulfilled') {
        this.matches = matches.value.matches;
      }

      if (jobs.status === 'fulfilled') {
        this.jobs = jobs.value.jobs;
        this.filteredJobs = jobs.value.jobs;
      }

      const hasFailure = [profile, applications, matches, jobs].some((item) => item.status === 'rejected');
      if (hasFailure) {
        this.errorMessage = 'Some dashboard data failed to load. You can still use the page and retry actions.';
      }
    } catch (error) {
      this.errorMessage = 'Unable to load candidate data.';
    } finally {
      this.loading = false;
    }
  }

  protected hasApplied(jobId: number): boolean {
    return this.applications.some((application) => application.jobId === jobId);
  }

  protected filterJobs(): void {
    const q = this.searchTerm.trim().toLowerCase();
    if (!q) {
      this.filteredJobs = this.jobs;
      return;
    }

    this.filteredJobs = this.jobs.filter((job) => {
      const text = [job.title, job.company, job.location, job.description].join(' ').toLowerCase();
      return text.includes(q);
    });
  }

  protected async applyToJob(jobId: number): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';
    try {
      await firstValueFrom(this.api.applyToJob(jobId));
      const applications = await firstValueFrom(this.api.listCandidateApplications());
      this.applications = applications.applications;
      this.successMessage = 'Application submitted successfully.';
    } catch (error) {
      this.errorMessage = 'Unable to submit application.';
    }
  }

  protected async saveProfile(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    const skills = this.profileForm.skillsInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      const response = await firstValueFrom(
        this.api.updateMyProfile({
          fullName: this.profileForm.fullName,
          headline: this.profileForm.headline,
          location: this.profileForm.location,
          bio: this.profileForm.bio,
          skills
        })
      );

      this.profile = response.profile;
      const matches = await firstValueFrom(this.api.getCandidateMatches());
      this.matches = matches.matches;
      this.successMessage = 'Profile updated.';
    } catch (error) {
      this.errorMessage = 'Unable to update profile.';
    }
  }

  protected async sendChatMessage(): Promise<void> {
    const message = this.chatInput.trim();
    if (!message) {
      return;
    }

    this.chatInput = '';
    try {
      const response = await firstValueFrom(this.api.assistantChat(message));
      this.chatHistory.push(...response.messages.map((item) => ({ sender: item.sender, content: item.content })));
    } catch (error) {
      this.errorMessage = 'Assistant is currently unavailable.';
    }
  }

  protected async startInterview(): Promise<void> {
    this.errorMessage = '';
    this.interviewFeedback = null;
    this.interviewAnswer = '';
    this.interviewQuestionIndex = 0;

    try {
      const response = await firstValueFrom(
        this.api.createInterviewSession({ roleTarget: 'Frontend Engineer', levelTarget: 'Junior' })
      );
      this.interviewSession = response.session;
    } catch (error) {
      this.errorMessage = 'Unable to create interview session.';
    }
  }

  protected async submitInterviewAnswer(): Promise<void> {
    if (!this.interviewSession || !this.interviewAnswer.trim()) {
      return;
    }

    try {
      const response = await firstValueFrom(
        this.api.submitInterviewAnswer(this.interviewSession.id, this.interviewQuestionIndex, this.interviewAnswer)
      );
      this.interviewSession = response.session;
      this.interviewAnswer = '';

      if (this.interviewQuestionIndex < this.interviewSession.questions.length - 1) {
        this.interviewQuestionIndex += 1;
      } else {
        const feedback = await firstValueFrom(this.api.getInterviewFeedback(this.interviewSession.id));
        this.interviewFeedback = feedback.feedback;
      }
    } catch (error) {
      this.errorMessage = 'Unable to submit interview answer.';
    }
  }
}
