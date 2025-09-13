import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { indianContactNumberValidator } from './validators';

@Directive({
  selector: '[appIndianContactNumber]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: IndianContactNumberDirective,
      multi: true,
    },
  ],
})
export class IndianContactNumberDirective implements Validator {
  constructor() {}
  validate(control: AbstractControl): ValidationErrors | null {
    return indianContactNumberValidator()(control);
  }
  registerOnValidatorChange?(fn: () => void): void {}
}
