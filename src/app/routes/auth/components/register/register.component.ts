import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  isLoading: boolean;
  badCredentials: boolean;

  constructor(private auth: AuthService) {
  }

  ngOnInit() {
  }

  submitForm(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.auth.signUp(form.value.email, form.value.password).subscribe(
      (succes) => {
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.badCredentials = true;
      }
    )
  }

}
