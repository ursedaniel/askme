import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../../routes/auth/services/auth.service';
import {Subscription} from 'rxjs';
import {NotificationModel} from "../../models/NotificationModel";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated: boolean;
  private authListenerSubs: Subscription;
  userType: string;
  notifications: Array<NotificationModel> = [];

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.auth.getIsAuth();
    this.userType = localStorage.getItem('type');
    if(this.userType == undefined || this.userType == null || this.userType == '')
      this.getType();
    this.authListenerSubs = this.auth.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userType = localStorage.getItem('type');
    });

    this.getNotifications();
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  onLogout() {
      this.auth.logOut();
  }

  updateType() {
    this.auth.changeType().subscribe(response => {
        this.userType = response.type.toString();
        localStorage.setItem('type', response.type.toString());
    });
  }

  getType() {
    this.auth.getType().subscribe(response => {
      this.userType = response.type.toString();
    });
  }

  getNotifications() {
    this.auth.socket.on('updatenotifications', notifications => {
      this.notifications = notifications;
    })
  }

}
