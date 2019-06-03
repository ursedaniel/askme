import {AbstractControl} from '@angular/forms';

export class UserValidator {
  static validatePassowrd(control: AbstractControl) {
    let password = control.get('password').value ? control.get('password').value : '';
    let hasNumber = /\d/.test(control.get('password').value);
    let hasUpper = /[A-Z]/.test(control.get('password').value);
    let hasLower = /[a-z]/.test(control.get('password').value);
    let hasSpecialCh = /\W/.test(control.get('password').value);
    let valid = hasUpper && hasLower && (hasNumber || hasSpecialCh);
    if (password.length < 8) {
      control.get('password').setErrors({pattern: true});

    } else if (!valid) {
      control.get('password').setErrors({controlPassword: true});
    }
  }
}
