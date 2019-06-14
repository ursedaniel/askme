import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import * as io from 'socket.io-client';
import {UserModel} from "../models/UserModel";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userAPI = 'http://localhost:3000/api/users/';
  socket: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.socket = io('http://localhost:3000');
  }

  // logIn(username: string, password: string) {
  //   let authData: AuthDataModel = {username: username, password: password};
  //   this.socket.on('message',function(data){
  //     console.log(data)
  //   });
  //   return this.http.post<{ token: string, expiresIn: number, type: number }>(this.loginAPI, authData).pipe(map((res => {
  //     this.socket.emit('login', authData.email);
  //     if (res.token) {
  //       const expiresIn = res.expiresIn;
  //       const now = new Date();
  //       const expirationDate = new Date(now.getTime() + expiresIn * 1000);
  //       localStorage.setItem('type', res.type.toString());
  //       this.router.navigateByUrl('');
  //     }
  //   })));
  // }

  getUser() {
    return this.http.get<{ message: string, user: UserModel }>(this.userAPI + 'myuser');
  }

  getOtherUser(username) {
    return this.http.post<UserModel>(this.userAPI + 'user',{username: username});
  }

  getConnections() {
    return this.http.get<{ message: string, connections: Array<UserModel> }>(this.userAPI + 'connections');
  }
}
