import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import * as io from 'socket.io-client';
import {UserModel} from "../models/UserModel";
import {LogsModel} from '../models/LogsModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userAPI = 'http://localhost:3000/api/users/';
  private logsAPI = 'http://localhost:3000/api/logs/';
  socket: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.socket = io('http://localhost:3000');
  }

  getUser() {
    return this.http.get<{ message: string, user: UserModel }>(this.userAPI + 'myuser');
  }

  getOtherUser(username) {
    return this.http.post<UserModel>(this.userAPI + 'user',{username: username});
  }

  getConnections() {
    return this.http.get<{ message: string, connections: Array<UserModel> }>(this.userAPI + 'connections');
  }

  getLogs(type) {
    return this.http.get<Array<LogsModel> >(this.logsAPI + "?type=" + type);
  }
}
