import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {AuthDataModel} from '../models/AuthDataModel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private registerAPI = 'http://localhost:3000/api/auth/register/';
  private loginAPI = 'http://localhost:3000/api/auth/login/';

  constructor(private http: HttpClient) {
  }

  signUp(email: string, password: string) {
    let authData: AuthDataModel = {email: email, password: password};
    return this.http.post<{ message: string}>(this.registerAPI, authData);
  }

  logIn(email: string, password: string) {
    let authData: AuthDataModel = {email: email, password: password};
    return this.http.post<{ message: string}>(this.loginAPI, authData);
  }
}
