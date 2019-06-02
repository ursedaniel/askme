import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {debounceTime} from 'rxjs/operators';
import {RegisterModel} from '../../models/RegisterModel';
import {RegisterValidator} from '../../validators/RegisterValidator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  isLoading: boolean;
  error: string;
  registerForm: FormGroup;
  registerModel: RegisterModel = new RegisterModel();
  submitted = false;


  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
  ) {
    document.body.classList.remove('navbar-top');
  }

  ngOnInit() {
    this.buildForm();
  }

  register() {
    this.isLoading = true;
    this.auth.register(this.registerModel).subscribe(
      (succes) => {
        this.toastr.success('Succes', 'Te-ai inregistrat cu succes. Te rugam sa te autentifici.');
        this.isLoading = false;
        this.router.navigateByUrl('/register/success');
      },
      (error) => {
        this.isLoading = false;
        this.toastr.error('Eroare', 'Aceasta adresa de email este deja utilizata.');
      }
    );
  }

  onSubmit(isvalid) {
    this.submitted = true;
    this.setObjectForm(this.registerForm.value);
    this.onValueChanged();
    if (isvalid) {
      this.register();
    }
  }



  buildForm(): void {
    this.registerForm = this.fb.group({
      email: [this.registerModel.email, [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$')]],
      password: [this.registerModel.password, [Validators.required]],
      confirmPassword: [this.registerModel.confirmPassword, [Validators.required]],
      firstName: [this.registerModel.firstName, [Validators.required]],
      surName: [this.registerModel.surName, [Validators.required]],
    }, {
      validator: RegisterValidator.matchPassword,
    });


    this.registerForm.valueChanges.pipe(debounceTime(500)).subscribe(data => {
      this.setObjectForm(data);
      this.onValueChanged();
    });
    this.onValueChanged();
  }

  onValueChanged() {
    if (!this.registerForm) {
      return;
    }

    for (let field in this.formErrors) {
      this.formErrors[field] = '';
      let control = this.registerForm.get(field);
      if (control && !control.valid) {
        let messages = this.validationMessages[field];
        for (let key in control.errors) {
          if (this.formErrors[field].length > 0) break;
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  formErrors = {
    'email': '',
    'password': '',
    'confirmPassword': '',
    'firstName': '',
    'surName': '',
    'phone': ''
  };

  validationMessages = {
    'email':{
      'required': 'Enter your email',
      'pattern': 'Email incorrect',
    },
    'password':{
      'required': 'Enter your password',
      'pattern':"Password must have at least 8 characters",
      'controlPassword':"Password must have at least 1 small and big letter & 1 number or character"
    },
    'confirmPassword':{
      'required': "Confirm your password",
      'errorConfirm': "Passwords does not match"
    },
    'firstName': {
      'required': 'Enter your first name',
    },
    'surName': {
      'required': 'Enter your last name',
    },
  };

  public setObjectForm(data: AbstractControl) {
    this.registerModel.email = data['email'];
    this.registerModel.password = data['password'];
    this.registerModel.confirmPassword = data['confirmPassword'];
    this.registerModel.firstName = data['firstName'];
    this.registerModel.surName = data['surName'];
  }

}
