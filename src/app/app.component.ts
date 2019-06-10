import {Component, OnInit} from '@angular/core';
import {AuthService} from './routes/auth/services/auth.service';
import * as socketIo from "socket.io-client";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  showModal: boolean;
  conn: any;

  constructor(
    private auth: AuthService) {
  }

  ngOnInit(): void {
    this.auth.socket.on('stream', (data) => {
      console.log('Request stream');
      console.log(data);
      if (data.streaming == 2)
        this.showModal = true;
      this.conn = data;
    });
    this.auth.socket.on('streamclose', () => {
      console.log('Closed stream');
      this.conn.streaming = 0;
      this.showModal = true;
      console.log(this.showModal);
    });
    this.auth.autoAuthUser();
  }

}
