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

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.auth.getIsAuth();
    this.authListenerSubs = this.auth.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  onLogout() {
      this.auth.logOut();
  }

}
