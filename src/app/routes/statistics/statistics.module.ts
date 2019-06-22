import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsComponent } from './components/statistics/statistics.component';
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {routing} from './routes/routes';
import {MatCardModule, MatTableModule, MatTabsModule} from "@angular/material";
import {StatisticsService} from './services/statistics.service';

@NgModule({
  declarations: [StatisticsComponent],
  imports: [
    CommonModule,
    NgxChartsModule,
    routing,
    MatCardModule,
    MatTabsModule,
    MatTableModule
  ],
  providers: [
    StatisticsService
  ]
})
export class StatisticsModule { }
