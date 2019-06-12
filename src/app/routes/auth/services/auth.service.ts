import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthDataModel} from '../models/AuthDataModel';
import {map} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import * as io from 'socket.io-client';
import {UserModel} from '../../user/models/UserModel';

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
  socket = io('http://localhost:3000', {autoConnect: false, rejectUnauthorized: null});
  // socket = io('wss://localhost:3000/ws', { autoConnect: false, transports: ['websocket'], rejectUnauthorized: false });

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
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

  register(registerModel: UserModel) {
    return this.http.post<{ message: string }>(this.registerAPI, registerModel);
  }

  logIn(username: string, password: string) {
    let authData: AuthDataModel = {username: username, password: password};
    // this.socket.on('message',function(data){
    //   console.log(data)
    // });
    return this.http.post<{ token: string, expiresIn: number, type: number }>(this.loginAPI, authData).pipe(map((res => {
      this.token = res.token;
      if (res.token) {
        // this.socket.emit('auth', authData.username);
        this.socket.on('connect', (data) => {
          console.log('Connected');
          this.socket.emit('authentication', {
            token: res.token
          });
        });
        this.socket.open();
        const expiresIn = res.expiresIn;
        this.setAuthTimer(expiresIn);
        this.isAuthenticated = true;
        this.authStatusToken.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresIn * 1000);
        this.saveAuthData(this.token, expirationDate, authData.username);
        localStorage.setItem('type', res.type.toString());
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
      this.socket.on('connect', () => {
        console.log('Connected');

        this.socket.emit('authentication', {
          token: authInformation.token
        });
      });
      // this.socket.emit('auth', localStorage.getItem('username'));
      this.socket.open();
      // this.socket.emit('auth', localStorage.getItem('username'));
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

  private saveAuthData(token: string, expirationDate: Date, username: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('username', username);
  }

  private clearAuthData() {
    this.socket.emit('disconnectNow', localStorage.getItem('username'));
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('username');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    const email = localStorage.getItem('username');
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
