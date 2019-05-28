import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthDataModel} from '../models/AuthDataModel';
import {map} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private registerAPI = 'http://localhost:3000/api/auth/register/';
  private loginAPI = 'http://localhost:3000/api/auth/login/';
  private typeAPI = 'http://localhost:3000/api/auth/type/';
  private token: string;
  private tokenTimer: any;
  private authStatusToken = new Subject<boolean>();
  private isAuthenticated = false;
  socket: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.socket = io('http://localhost:3000');
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusToken.asObservable();
  }

  signUp(email: string, password: string) {
    let authData: AuthDataModel = {email: email, password: password};
    return this.http.post<{ message: string }>(this.registerAPI, authData);
  }

  logIn(email: string, password: string) {
    let authData: AuthDataModel = {email: email, password: password};
    this.socket.on('message',function(data){
      console.log(data)
    });
    return this.http.post<{ token: string, expiresIn: number, type: number }>(this.loginAPI, authData).pipe(map((res => {
      this.socket.emit('login', authData.email);
      this.token = res.token;
      if (res.token) {
        const expiresIn = res.expiresIn;
        this.setAuthTimer(expiresIn);
        this.isAuthenticated = true;
        localStorage.setItem('type', res.type.toString());
        this.authStatusToken.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresIn * 1000);
        this.saveAuthData(this.token, expirationDate, authData.email);
        this.router.navigateByUrl('');
      }
    })));
  }

  logOut() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusToken.next(false);
    this.router.navigateByUrl('');
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expiration.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.socket.emit('login', localStorage.getItem('email'));
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.authStatusToken.next(true);
      this.setAuthTimer(expiresIn / 1000);
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, email: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('email', email);
  }

  private clearAuthData() {
    this.socket.emit('disconnectNow', localStorage.getItem('email'));
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('email');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    const email = localStorage.getItem('email');
    if (!token || !expiration) {
      return;
    }
    return {
      token: token,
      expiration: new Date(expiration),
      email: email
    };
  }

  changeType() {
    return this.http.get<{ message: string, type: boolean }>(this.typeAPI + 'update');
  }

  getType() {
    return this.http.get<{ message: string, type: boolean }>(this.typeAPI);
  }
}
