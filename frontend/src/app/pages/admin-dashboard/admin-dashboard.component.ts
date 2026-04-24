import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { AuthStateService } from '../../core/auth-state.service';
import { JobApiService } from '../../core/job-api.service';
import { AuthUser } from '../../core/types';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  protected readonly email: string;
  protected loading = false;
  protected errorMessage = '';
  protected metrics: {
    usersCount: number;
    candidateProfilesCount: number;
    jobsCount: number;
    applicationsCount: number;
    interviewSessionsCount: number;
    chatMessagesCount: number;
  } | null = null;
  protected users: AuthUser[] = [];
  protected readonly heroImage =
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=80';
  protected readonly mapImage =
    'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80';
  protected readonly growthSeries = [45, 52, 60, 67, 74, 88, 96];
  protected readonly conversionSeries = [18, 24, 31, 29, 36, 44, 47];
  protected readonly weeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  protected readonly sourceBreakdown = [
    { source: 'Campus partners', value: 39, color: '#2563eb' },
    { source: 'Organic search', value: 27, color: '#14b8a6' },
    { source: 'Referral network', value: 21, color: '#f59e0b' },
    { source: 'Paid campaigns', value: 13, color: '#f43f5e' }
  ];
  protected readonly flaggedSignals = [
    '4 jobs with incomplete salary ranges',
    '2 recruiters with pending verification',
    '1 candidate reported suspicious message content'
  ];

  constructor(
    authState: AuthStateService,
    private readonly api: JobApiService
  ) {
    this.email = authState.getEmail();
    this.seedInstantAdminData();
  }

  ngOnInit(): void {
    void this.loadData();
  }

  private seedInstantAdminData(): void {
    this.metrics = {
      usersCount: 1234,
      candidateProfilesCount: 986,
      jobsCount: 214,
      applicationsCount: 3540,
      interviewSessionsCount: 712,
      chatMessagesCount: 9481
    };
    this.users = [
      { id: 1, email: 'candidate@joblink.dev', role: 'candidate', createdAt: new Date().toISOString() },
      { id: 2, email: 'recruiter@joblink.dev', role: 'recruiter', createdAt: new Date().toISOString() },
      { id: 3, email: 'admin@joblink.dev', role: 'admin', createdAt: new Date().toISOString() }
    ];
  }

  protected maxSeriesValue(series: number[]): number {
    return Math.max(...series, 1);
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
      const [metrics, users] = await Promise.all([
        this.withTimeout(firstValueFrom(this.api.getAdminMetrics()), 3500),
        this.withTimeout(firstValueFrom(this.api.listAdminUsers()), 3500)
      ]);

      this.metrics = metrics.metrics;
      this.users = users.users;
    } catch (error) {
      this.errorMessage = 'Unable to load admin data.';
    } finally {
      this.loading = false;
    }
  }
}
