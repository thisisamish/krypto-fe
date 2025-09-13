import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';
import { AuthService } from '../../../auth/services/auth.service';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { RegisterPayload } from '../../../auth/models/auth.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { StrongPasswordDirective } from '../../../../shared/directives/strong-password.directive';
import { IndianContactNumberDirective } from '../../../../shared/directives/indian-contact-number.directive';

@Component({
  selector: 'app-register-page',
  imports: [
    CardComponent,
    FormsModule,
    CommonModule,
    FormInputComponent,
    StrongPasswordDirective,
    IndianContactNumberDirective,
  ],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  // Use the write-DTO (RegisterPayload), not the read model
  register: RegisterPayload = {
    username: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    address: '',
    contactNo: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.invalid) {
      console.log('Form is invalid.');
      return;
    }

    console.log('Submitting user:', {
      ...this.register,
      password: '[REDACTED]',
    });

    this.authService.register(this.register).subscribe({
      next: () => {
        console.log('Registration successful! (204 No Content)');
        alert('User registered successfully!');
        // Clear password locally after submit
        this.register.password = '';
        form.resetForm(); // resets template-driven form

        // Redirect to login page
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Registration failed:', err);
        alert(`Registration failed: ${this.extractErrorMessage(err)}`);
      },
    });
  }

  private extractErrorMessage(err: HttpErrorResponse): string {
    // Spring validation often returns { errors: [{ field, defaultMessage }...] } or { message: "..." }
    const anyErr = err?.error as any;

    if (typeof anyErr === 'string' && anyErr.trim()) return anyErr;

    if (anyErr?.message) return anyErr.message;

    if (Array.isArray(anyErr?.errors) && anyErr.errors.length) {
      // Join all validation messages
      return anyErr.errors
        .map((e: any) => e.defaultMessage || e.message || JSON.stringify(e))
        .join('\n');
    }

    return 'Server error';
  }
}
