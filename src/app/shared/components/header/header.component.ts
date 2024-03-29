import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../../routes/auth/services/auth.service';
import {Subscription} from 'rxjs';
import {NotificationModel} from "../../models/NotificationModel";
import {NotificationService} from "../../services/notification.service";
import {UserModel} from "../../../routes/user/models/UserModel";
import {LoaderModel} from "../../models/LoaderModel";
import {UserService} from "../../../routes/user/services/user.service";
import {ToastrService} from "ngx-toastr";

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
  user: UserModel = new UserModel();

  constructor(
    private auth: AuthService,
    private us: UserService,
    private ns: NotificationService,
    private ts: ToastrService
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
      this.getUser();
    });

    if (this.userIsAuthenticated) {
      this.getNotifications();
      this.getUser();
    }

    this.auth.socket.on('updatenotifications', notifications => {
      this.notifications = notifications;
      this.newNots = 0;
      this.notifications.forEach(notification => {
        if (notification.checked == false)
          this.newNots++;
      })
    })
  }

  getUser() {
    this.us.getUser().subscribe((response) => {
      this.user = response.user;
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

  checkAll() {
    this.ns.checkAll().subscribe(
      (response) => {
        this.ts.success('Success', 'You marked everything as checked.');
        this.getNotifications();
      }
    )
  }

  deleteAll() {
    this.ns.deleteAll().subscribe(
      (response) => {
        this.ts.success('Success', 'You deleted all notifications.');
        this.getNotifications();
      }
    )
  }

}
