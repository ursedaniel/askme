import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../../routes/auth/services/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated: boolean;
  private authListenerSubs: Subscription;
  userType: string;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.auth.getIsAuth();
    this.userType = localStorage.getItem('type');
    this.authListenerSubs = this.auth.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userType = localStorage.getItem('type');
    });
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  onLogout() {
      this.auth.logOut();
  }

  updateType() {
    this.auth.changeType().subscribe();
  }

}
