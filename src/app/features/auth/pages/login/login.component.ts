import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginPayload } from '../../models/auth.dto';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormInputComponent, CardComponent, FormsModule],
  template: `
    <app-card
      title="Login to your account"
      subtitle="Enter your username and password to login to your account"
    >
      <form
        #loginForm="ngForm"
        (ngSubmit)="onSubmit(loginForm)"
        class="flex flex-col gap-6"
      >
        <!-- <hr>
        <h3>Debugging Info:</h3>
        <pre>{{ loginForm.value | json }}</pre>
        <p>
            Is the form valid?
            <strong>{{ loginForm.valid }}</strong>
        </p> -->

        <div class="flex flex-col gap-2">
          <app-form-input
            label="Username"
            type="text"
            placeholder="Enter an username"
            [(ngModel)]="login.username"
            name="loginUsername"
            required
          ></app-form-input>

          <app-form-input
            label="Password"
            type="password"
            placeholder="Enter a strong password"
            [(ngModel)]="login.password"
            name="loginPassword"
            required
          ></app-form-input>
        </div>

        <div
          *ngIf="errorMessage"
          class="text-red-900 bg-red-300 border border-red-900 rounded-sm text-center py-1"
        >
          {{ errorMessage }}
        </div>

        <button
          [disabled]="!loginForm.valid"
          class="p-2 rounded-md bg-green-400 text-white cursor-pointer hover:bg-green-600 disabled:bg-gray-400"
          type="submit"
        >
          Login
        </button>
      </form>

      <div class="mt-4">
        <p>
          Don't have an account?
          <a
            href="/register"
            class="underline relative z-10 cursor-pointer inline-block mt-2"
            >Register</a
          >
        </p>
      </div>
    </app-card>
  `,
})
export class LoginComponent {
  login: LoginPayload = {
    username: '',
    password: '',
  };

  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.errorMessage = null;

    this.authService.login(this.login).subscribe({
      next: (response) => {
        // Normalize to match guards/routes expecting 'admin' | 'customer'
        const role = this.authService.normalizeRole(response?.role);
        console.log('Login successful, role:', role ?? response?.role);

        if (role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (role === 'customer') {
          this.router.navigate(['/']);
        } else {
          // fallback if backend sends something unexpected
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.errorMessage =
          err?.error?.error || 'An unknown error occured. Please try again.';
      },
    });
  }
}
