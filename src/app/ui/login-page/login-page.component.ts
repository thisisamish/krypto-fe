// src/app/pages/login/login-page.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-md mx-auto mt-10 p-6 border rounded-xl">
      <h1 class="text-2xl font-bold mb-4">Login</h1>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <label class="block mb-2">Username / Email</label>
        <input
          class="w-full border rounded px-3 py-2 mb-4"
          formControlName="identifier"
        />
        <label class="block mb-2">Password</label>
        <input
          type="password"
          class="w-full border rounded px-3 py-2 mb-4"
          formControlName="password"
        />
        <button
          class="w-full bg-green-600 text-white py-2 rounded"
          [disabled]="form.invalid || loading"
        >
          {{ loading ? 'Signing in...' : 'Login' }}
        </button>
      </form>
    </div>
  `,
})
export class LoginPageComponent {
  loading = false;
  form: ReturnType<FormBuilder['group']>;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      identifier: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.login(this.form.value as any).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (e) => {
        console.error(e);
        this.loading = false;
      },
    });
  }
}
