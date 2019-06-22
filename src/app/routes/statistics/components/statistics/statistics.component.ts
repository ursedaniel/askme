import {Component, OnInit} from '@angular/core';
import {StatisticsService} from "../../services/statistics.service";
import {LogsModel} from "../../../user/models/LogsModel";
import {StatsModel} from "../../models/StatsModel";
import {Router} from "@angular/router";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  allWeekChart: any[] = [];
  allDayChart: any[] = [];
  view: any[] = [700, 400];
  gradient = false;
  showLegend = true;
  displayedColumns: string[] = ['viewer','date','profile'];
  displayedColumnsPrivate: string[] = ['viewer','date'];
  weekStats: Array<StatsModel> = [];
  dayStats: Array<StatsModel> = [];

  colorScheme = {
    domain: ['#673ab7', '#9642c4', '#9e43c4', '#9a70c4']
  };

  constructor(
    private ss: StatisticsService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.getStats();
  }

  changeTabs(event) {
    if(event.index == 0)
      this.getStats();
    else if(event.index == 1)
      this.getStatsProfile();
    else
      this.getStatsTable();
  }

  getStats() {
    this.allWeekChart = [];
    this.allDayChart = [];
    this.ss.getStats().subscribe(
      (response)=> {
        this.allWeekChart = [];
        for(let i = 0 ; i < response.weekStats.length; i++) {
          this.allWeekChart.push(response.weekStats[i]);
        }
        this.weekStats = response.statsWeekInitial;

        this.allDayChart = [];
        for(let i = 0 ; i < response.todayStats.length; i++) {
          this.allDayChart.push(response.todayStats[i]);
        }
        this.dayStats = response.statsTodayInitial;
      }
    )
  }

  getStatsProfile() {
    this.allWeekChart = [];
    this.allDayChart = [];
    this.ss.getStatsProfile().subscribe(
      (response)=> {
        this.allWeekChart = [];
        for(let i = 0 ; i < response.weekStats.length; i++) {
          this.allWeekChart.push(response.weekStats[i]);
        }
        this.weekStats = response.statsWeekInitial;

        this.allDayChart = [];
        for(let i = 0 ; i < response.todayStats.length; i++) {
          this.allDayChart.push(response.todayStats[i]);
        }
        this.dayStats = response.statsTodayInitial;
      }
    )
  }

  getStatsTable() {
    this.allWeekChart = [];
    this.allDayChart = [];
    this.ss.getStatsTable().subscribe(
      (response)=> {
        this.allWeekChart = [];
        for(let i = 0 ; i < response.weekStats.length; i++) {
          this.allWeekChart.push(response.weekStats[i]);
        }
        this.weekStats = response.statsWeekInitial;

        this.allDayChart = [];
        for(let i = 0 ; i < response.todayStats.length; i++) {
          this.allDayChart.push(response.todayStats[i]);
        }
        this.dayStats = response.statsTodayInitial;
      }
    )
  }

  connectUser(username) {
    this.router.navigateByUrl('/user/account?user=' + username);
  }

  onSelect(event) {
    console.log(event);
  }
}
