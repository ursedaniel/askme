import {Component, OnInit} from '@angular/core';
import {AuthService} from './routes/auth/services/auth.service';
import {Router, NavigationStart, NavigationEnd} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  showModal: boolean;
  conn: any;
  currentRoute: string;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    router.events.forEach((event) => {
        if (event instanceof NavigationEnd) {
          this.currentRoute = event.url.split('?')[0];
        }
      }
    );
  }

  ngOnInit(): void {
    this.auth.socket.on('stream', (data) => {
      console.log(data);
      console.log('Request stream');
      if (data.streaming == 2)
        this.showModal = true;
      this.conn = data;
      if (this.currentRoute == '/stream' || this.currentRoute == '/review')
        this.router.navigateByUrl('/home');
    });
    this.auth.socket.on('streamclose', () => {
      console.log('Closed stream');
      this.conn.streaming = 0;
      this.showModal = true;
      if (this.currentRoute == '/stream' || this.currentRoute == '/review')
        this.router.navigateByUrl('/home');
    });
    this.auth.autoAuthUser();
  }

}
