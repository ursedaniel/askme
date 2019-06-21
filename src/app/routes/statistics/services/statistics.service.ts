import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import * as io from 'socket.io-client';
import {UserModel} from "../../user/models/UserModel";

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  private statsAPI = 'http://localhost:3000/api/statistics/';
  socket: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.socket = io('http://localhost:3000');
  }

  addStat(users: Array<UserModel>) {
    return this.http.post(this.statsAPI, users);
  }

  addStatProfile(username: string) {
    return this.http.post(this.statsAPI + '/user', {username:username});
  }

  // getConnections(categoryName) {
  //   return this.http.get<{ message: string, connections: Array<UserModel> }>(this.userAPI + 'connections?category=' + categoryName);
  // }
}
