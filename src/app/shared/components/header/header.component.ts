import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../../routes/auth/services/auth.service';
import {Subscription} from 'rxjs';
import {NotificationModel} from "../../models/NotificationModel";
import {NotificationService} from "../../services/notification.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated: boolean;
  private authListenerSubs: Subscription;
  userType: string;
  notifications: Array<NotificationModel> = [];
  newNots: number = 0;
  showNotifications: boolean;

  constructor(
    private auth: AuthService,
    private ns: NotificationService
  ) {
  }

  ngOnInit() {
    this.userIsAuthenticated = this.auth.getIsAuth();
    this.userType = localStorage.getItem('type');
    this.authListenerSubs = this.auth.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      if (this.userType == undefined || this.userType == null || this.userType == '')
        this.getType();
      this.userType = localStorage.getItem('type');
      this.getNotifications();
    });

    if (this.userIsAuthenticated)
      this.getNotifications();

    this.auth.socket.on('updatenotifications', notifications => {
      this.notifications = notifications;
      this.newNots = 0;
      this.notifications.forEach(notification => {
        if (notification.checked == false)
          this.newNots++;
      })
    })
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  onLogout() {
    this.newNots = 0;
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
    this.newNots = 0;
    this.ns.getNotifications().subscribe(
      (response) => {
        this.notifications = response;
        this.notifications.forEach(notification => {
          if (notification.checked == false)
            this.newNots++;
        })
      }
    );
  }

  readNotification(n) {
    this.ns.checkNotification(n).subscribe(
      (succes) => {
        setTimeout(() => {
          this.getNotifications();
        }, 500);
      }
    )
  }

}
