import {AbstractControl} from '@angular/forms';

export class RegisterValidator {
  static matchPassword(control: AbstractControl) {
    let password = control.get('password').value ? control.get('password').value : '';
    let confirmPassword = control.get('confirmPassword').value;
    let hasNumber = /\d/.test(control.get('password').value);
    let hasUpper = /[A-Z]/.test(control.get('password').value);
    let hasLower = /[a-z]/.test(control.get('password').value);
    let hasSpecialCh = /\W/.test(control.get('password').value);
    let valid = hasUpper && hasLower && (hasNumber || hasSpecialCh);
    if (password != confirmPassword) {
      control.get('confirmPassword').setErrors({errorConfirm: true});
    }
    if (password.length < 8) {
      control.get('password').setErrors({pattern: true});

    } else if (!valid) {
      control.get('password').setErrors({controlPassword: true});
    }
  }
}
