import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CardComponent } from '../../components/card/card.component';
import { FormInputComponent } from '../../components/form-input/form-input.component';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginPayload } from '../../models/auth.dto';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, FormInputComponent, CardComponent, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
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
