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

  single: any[] = [ {
    "name": "Germany",
    "value": 8940000
  },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "France",
      "value": 7200000
    }];

  view: any[] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Month';
  showYAxisLabel = true;
  yAxisLabel = '';

  colorScheme = {
    domain: ['#673ab7', '#9642c4', '#9e43c4', '#9a70c4']
  };

  // line, area
  autoScale = true;

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
          this.logs = response.logs;
          this.logs.map(log => {
            this.totalPoints += Number(log.price);
          });
          this.single = [];
          for(let i = 0 ; i < response.chart.length; i++) {
            this.single.push(response.chart[i]);
          }
          if(this.userType == 'false')
            this.yAxisLabel = 'Earnings';
          else
            this.yAxisLabel = 'Payments';
        }
      )
  }

  onSelect(event) {
    console.log(event);
  }

}
