import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { strongPasswordValidator } from '../shared/validators';

@Directive({
  selector: '[appStrongPassword]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: StrongPasswordDirective,
      multi: true,
    },
  ],
})
export class StrongPasswordDirective implements Validator {
  constructor() {}
  validate(control: AbstractControl): ValidationErrors | null {
    return strongPasswordValidator()(control);
  }
  registerOnValidatorChange?(fn: () => void): void {}
}
