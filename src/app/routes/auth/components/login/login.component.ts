import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, NgForm, Validators} from '@angular/forms';
import {AuthDataModel} from '../../models/AuthDataModel';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoading: boolean;

  constructor(private auth: AuthService) {
  }

  ngOnInit() {
  }

  submitForm(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.auth.logIn(form.value.email, form.value.password).subscribe(
      (succes) => {
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
      }
    )
  }

}