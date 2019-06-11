import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {debounceTime} from 'rxjs/operators';
import {RegisterValidator} from '../../validators/RegisterValidator';
import {UserModel} from "../../../user/models/UserModel";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  isLoading: boolean;
  error: string;
  registerForm: FormGroup;
  registerModel: UserModel = new UserModel();
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
        this.router.navigateByUrl('auth/login');
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
      name: [this.registerModel.name, [Validators.required]],
      username: [this.registerModel.username, [Validators.required]],
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
    'name': '',
    'username': '',
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
    'name': {
      'required': 'Enter your full name',
    },
    'username': {
      'required': 'Enter your username',
      'pattern': 'Only letters/digits allowed'
    },
  };

  public setObjectForm(data: AbstractControl) {
    this.registerModel.email = data['email'];
    this.registerModel.password = data['password'];
    this.registerModel.confirmPassword = data['confirmPassword'];
    this.registerModel.name = data['name'];
    this.registerModel.username = data['username'];
  }

}
