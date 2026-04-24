import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthStateService } from '../../core/auth-state.service';
import { AuthApiService } from '../../core/auth-api.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  protected email = '';
  protected password = '';
  protected role: 'candidate' | 'recruiter' | 'admin' = 'candidate';
  protected mode: 'login' | 'register' = 'login';
  protected loading = false;
  protected errorMessage = '';

  constructor(
    private readonly authState: AuthStateService,
    private readonly authApi: AuthApiService,
    private readonly router: Router
  ) {}

  protected async submit(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      if (this.mode === 'register') {
        await firstValueFrom(this.authApi.register(this.email, this.password, this.role));
      }

      const loginResponse = await firstValueFrom(this.authApi.login(this.email, this.password));

      if (loginResponse.user.role !== this.role) {
        this.errorMessage = `This account is ${loginResponse.user.role}, not ${this.role}. Please select the correct role.`;
        this.authState.clearSession();
        return;
      }

      this.authState.setSession(loginResponse.token, loginResponse.user.role);
      this.authState.setEmail(loginResponse.user.email);
      await this.router.navigate([`/${loginResponse.user.role}`]);
    } catch (error) {
      this.errorMessage = 'Authentication failed. Please verify your credentials.';
    } finally {
      this.loading = false;
    }
  }

  protected toggleMode(): void {
    this.mode = this.mode === 'login' ? 'register' : 'login';
    this.errorMessage = '';
  }
}
