import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { JobApiService } from '../../core/job-api.service';
import { AuthStateService } from '../../core/auth-state.service';
import { FormsModule } from '@angular/forms';
import { Application, Job } from '../../core/types';

@Component({
  selector: 'app-recruiter-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './recruiter-dashboard.component.html',
  styleUrl: './recruiter-dashboard.component.scss'
})
export class RecruiterDashboardComponent implements OnInit {
  protected loading = false;
  protected jobs: Job[] = [];
  protected selectedJobId: number | null = null;
  protected selectedJobApplications: Application[] = [];
  protected creatingJob = false;
  protected successMessage = '';
  protected errorMessage = '';
  protected readonly email: string;
  protected readonly heroImage =
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80';
  protected readonly officeImage =
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80';
  protected readonly kpis = [
    { label: 'Open roles', value: '9', trend: '+2 this week' },
    { label: 'Applicants', value: '146', trend: '34 shortlisted' },
    { label: 'Interview rate', value: '29%', trend: '+4% MoM' },
    { label: 'Time to hire', value: '17 days', trend: '-3 days' }
  ];
  protected readonly pipeline = [
    { stage: 'New', count: 41, color: '#60a5fa' },
    { stage: 'Screening', count: 29, color: '#818cf8' },
    { stage: 'Interview', count: 17, color: '#22c55e' },
    { stage: 'Offer', count: 6, color: '#f59e0b' }
  ];
  protected jobForm = {
    title: '',
    company: '',
    location: '',
    employmentType: 'full-time',
    salaryRange: '',
    description: '',
    requiredSkillsInput: '',
    status: 'published'
  };

  constructor(
    private readonly api: JobApiService,
    authState: AuthStateService
  ) {
    this.email = authState.getEmail();
    this.seedInstantRecruiterData();
  }

  ngOnInit(): void {
    void this.loadData();
  }

  private seedInstantRecruiterData(): void {
    this.jobs = [
      {
        id: 201,
        recruiterId: 0,
        title: 'Frontend Engineer - Growth Squad',
        company: 'NovaTech Labs',
        location: 'Remote Europe',
        employmentType: 'full-time',
        salaryRange: 'EUR 50k - 65k',
        description: 'Build acquisition and activation user journeys for our AI hiring platform.',
        requiredSkills: ['angular', 'typescript', 'experimentation'],
        status: 'published',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 202,
        recruiterId: 0,
        title: 'Junior Data Analyst',
        company: 'Northwind Insights',
        location: 'Paris, France',
        employmentType: 'full-time',
        salaryRange: 'EUR 40k - 50k',
        description: 'Translate hiring funnel data into actionable operational insights.',
        requiredSkills: ['sql', 'dashboarding', 'storytelling'],
        status: 'published',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 203,
        recruiterId: 0,
        title: 'Design System Intern',
        company: 'Pulse AI',
        location: 'Berlin Hybrid',
        employmentType: 'internship',
        salaryRange: 'EUR 1.6k / month',
        description: 'Contribute to token library and accessibility checks across product surfaces.',
        requiredSkills: ['figma', 'ui', 'accessibility'],
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    this.selectedJobId = 201;
    this.selectedJobApplications = [
      {
        id: 5101,
        jobId: 201,
        candidateUserId: 0,
        status: 'screening',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        history: [
          { at: new Date().toISOString(), status: 'applied', note: 'Applied via campus fair' },
          { at: new Date().toISOString(), status: 'screening', note: 'Strong portfolio quality' }
        ]
      },
      {
        id: 5102,
        jobId: 201,
        candidateUserId: 0,
        status: 'interview',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        history: [
          { at: new Date().toISOString(), status: 'applied', note: 'Referral from alumni' },
          { at: new Date().toISOString(), status: 'interview', note: 'Tech interview scheduled Friday' }
        ]
      }
    ];
  }

  private withTimeout<T>(promise: Promise<T>, timeoutMs = 8000): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        setTimeout(() => reject(new Error('request timed out')), timeoutMs);
      })
    ]);
  }

  private async loadData(): Promise<void> {
    this.loading = true;
    try {
      const jobs = await this.withTimeout(firstValueFrom(this.api.listRecruiterJobs()), 3500);
      this.jobs = jobs.jobs;
    } catch (error) {
      this.errorMessage = 'Unable to load recruiter jobs.';
    } finally {
      this.loading = false;
    }
  }

  protected async createJob(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';
    this.creatingJob = true;

    const requiredSkills = this.jobForm.requiredSkillsInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      await firstValueFrom(
        this.api.createRecruiterJob({
          title: this.jobForm.title,
          company: this.jobForm.company,
          location: this.jobForm.location,
          employmentType: this.jobForm.employmentType,
          salaryRange: this.jobForm.salaryRange,
          description: this.jobForm.description,
          requiredSkills,
          status: this.jobForm.status
        })
      );

      await this.loadData();
      this.successMessage = 'Job created successfully.';
      this.jobForm = {
        title: '',
        company: '',
        location: '',
        employmentType: 'full-time',
        salaryRange: '',
        description: '',
        requiredSkillsInput: '',
        status: 'published'
      };
    } catch (error) {
      this.errorMessage = 'Unable to create job.';
    } finally {
      this.creatingJob = false;
    }
  }

  protected async viewApplications(jobId: number): Promise<void> {
    this.selectedJobId = jobId;
    this.errorMessage = '';
    try {
      const response = await firstValueFrom(this.api.listJobApplicationsForRecruiter(jobId));
      this.selectedJobApplications = response.applications;
    } catch (error) {
      this.errorMessage = 'Unable to load job applications.';
    }
  }

  protected async updateApplication(applicationId: number, status: string): Promise<void> {
    this.errorMessage = '';
    try {
      await firstValueFrom(this.api.updateApplicationStatus(applicationId, status));
      if (this.selectedJobId) {
        await this.viewApplications(this.selectedJobId);
      }
    } catch (error) {
      this.errorMessage = 'Unable to update application status.';
    }
  }
}
