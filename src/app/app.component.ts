import {Component, OnInit} from '@angular/core';
import {AuthService} from './routes/auth/services/auth.service';
import * as socketIo from "socket.io-client";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private auth: AuthService) {
  }

  ngOnInit(): void {
    this.auth.autoAuthUser();
  }

}
