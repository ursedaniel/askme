import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {LogsModel} from '../../models/LogsModel';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {

  displayedColumns: string[] = ['datestart', 'dateend','duration','username1',  'username2', 'price'];
  logs: Array<LogsModel> = [];
  userType: string;
  totalPoints = 0;

  constructor(
    private us: UserService,
  ) { }

  ngOnInit() {
    this.userType = localStorage.getItem('type');
    this.getLogs();
  }

  getLogs() {
      this.us.getLogs(this.userType).subscribe(
        (response) => {
          this.logs = response;
          this.logs.map(log => {
            this.totalPoints += Number(log.price);
          })
        }
      )
  }

}
