import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {NotificationModel} from "../models/NotificationModel";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationAPI = 'http://localhost:3000/api/notifications/';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
  }

  checkNotification(n: NotificationModel) {
    return this.http.post(this.notificationAPI + '/check', n);
  }

  getNotifications() {
    return this.http.get<Array<NotificationModel>>(this.notificationAPI);
  }
}
