import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsComponent } from './components/statistics/statistics.component';
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {routing} from './routes/routes';
import {MatCardModule} from "@angular/material";

@NgModule({
  declarations: [StatisticsComponent],
  imports: [
    CommonModule,
    NgxChartsModule,
    routing,
    MatCardModule
  ]
})
export class StatisticsModule { }
