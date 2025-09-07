import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * emailValidator
 * - Ignores empty values (use `Validators.required` separately if needed)
 * - Validates a basic, practical email shape (local@domain.tld)
 */
export const emailValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const raw = control.value as string | null | undefined;
  if (raw == null || raw === '') return null; // let "required" handle empties

  const value = String(raw).trim();

  // Pragmatic pattern (close to HTML5 spec-level strictness without overfitting RFC 5322)
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  return EMAIL_RE.test(value) ? null : { email: true };
};

export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const passwordValid = hasNumber && hasSpecialChar;

    return !passwordValid ? { strongPassword: true } : null;
  };
}

export function indianContactNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const isValid = /^[6-9]\d{9}$/.test(value);

    return !isValid ? { invalidContactNumber: true } : null;
  };
}
