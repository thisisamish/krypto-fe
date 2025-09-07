import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormInputComponent } from '../../components/form-input/form-input.component';
import { StrongPasswordDirective } from '../../directives/strong-password.directive';
import { IndianContactNumberDirective } from '../../directives/indian-contact-number.directive';
import { AuthService } from '../../services/auth.service';
import { CardComponent } from '../../components/card/card.component';
import { RegisterPayload } from '../../models/auth.dto';

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
  styleUrl: './register-page.component.css',
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

  constructor(private authService: AuthService) {}

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
      next: (response) => {
        console.log('Registration successful!', response);
        alert('User registered successfully!');
        // Clear password locally after submit
        this.register.password = '';
        form.resetForm(); // resets template-driven form
      },
      error: (err) => {
        console.error('Registration failed:', err);
        alert(`Registration failed: ${err?.error?.message || 'Server error'}`);
      },
    });
  }
}
