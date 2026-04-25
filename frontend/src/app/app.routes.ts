import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { roleGuard } from './core/role.guard';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/login/login.component';
import { CandidateDashboardComponent } from './pages/candidate-dashboard/candidate-dashboard.component';
import { RecruiterDashboardComponent } from './pages/recruiter-dashboard/recruiter-dashboard.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'candidate',
    component: CandidateDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['candidate'] }
  },
  {
    path: 'recruiter',
    component: RecruiterDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['recruiter'] }
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: '**', redirectTo: '' }
];
