import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { UserProfile, UserService } from '../../../services/user.service';

@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="p-4 sm:p-6 bg-white rounded-lg shadow">
       <h2 class="text-xl font-bold mb-4">My Info</h2>
       <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Username</label>
          <input
            class="input input-bordered w-full bg-gray-100"
            formControlName="username"
            readonly
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">First Name</label>
            <input
              class="input input-bordered w-full"
              formControlName="firstName"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Middle Name</label>
            <input
              class="input input-bordered w-full"
              formControlName="middleName"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Last Name</label>
            <input
              class="input input-bordered w-full"
              formControlName="lastName"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input
              class="input input-bordered w-full"
              formControlName="email"
              type="email"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Address</label>
          <textarea
            class="textarea textarea-bordered w-full"
            formControlName="address"
            rows="3"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Contact Number</label>
          <input
            class="input input-bordered w-full"
            formControlName="contactNo"
          />
        </div>

        <div class="flex items-center gap-3 pt-2">
          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="form.invalid || form.pristine || loading"
          >
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
          <span *ngIf="error" class="text-red-600 text-sm">{{ error }}</span>
          <span *ngIf="saved" class="text-green-600 text-sm">Profile saved successfully!</span>
        </div>
      </form>
    </div>
  `,
})
export class ProfileInfoComponent implements OnInit {
  loading = false;
  error: string | null = null;
  saved = false;
  form: FormGroup;

  constructor(private fb: FormBuilder, private users: UserService) {
    this.form = this.fb.group({
      username: [{ value: '', disabled: true }],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      middleName: ['', [Validators.maxLength(50)]],
      lastName: ['', [Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.maxLength(255)]],
      contactNo: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    });
  }

  ngOnInit() {
    this.loading = true;
    this.users.getMe().subscribe({
      next: (me) => {
        this.loading = false;
        this.form.patchValue(me);
        this.form.get('username')?.setValue(me.username);
      },
      error: (err) => {
        this.loading = false;
        this.error = this.pickMessage(err);
      },
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;
    this.saved = false;

    const payload = this.form.getRawValue() as UserProfile;

    this.users.updateMe(payload).subscribe({
      next: (updated) => {
        this.loading = false;
        this.saved = true;
        this.form.markAsPristine(); // Mark form as unchanged
        setTimeout(() => this.saved = false, 3000); // Hide message after 3s
      },
      error: (err) => {
        this.loading = false;
        this.error = this.pickMessage(err);
      },
    });
  }

   private pickMessage(err: any): string {
    const anyErr = err?.error;
    if (typeof anyErr === 'string' && anyErr.trim()) return anyErr;
    if (anyErr?.message) return anyErr.message;
    if (Array.isArray(anyErr?.errors) && anyErr.errors.length) {
      return anyErr.errors.map((e: any) => e.defaultMessage || e.message).join('\n');
    }
    return 'An unexpected server error occurred.';
  }
}
