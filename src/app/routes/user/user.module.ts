import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyprofileComponent } from './components/myprofile/myprofile.component';
import {routing} from './routes/routes';
import {UserService} from "./services/user.service";
import {
  MatButtonModule, MatChipsModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule, MatSelectModule,
  MatTableModule
} from "@angular/material";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ReviewService} from "../review/services/review.service";
import { LogsComponent } from './components/logs/logs.component';
import {StatisticsService} from "../statistics/services/statistics.service";
import {NgxChartsModule} from "@swimlane/ngx-charts";

@NgModule({
  declarations: [MyprofileComponent, LogsComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    routing,
    MatExpansionModule,
    MatTableModule,
    MatSelectModule,
    MatChipsModule,
    NgxChartsModule
  ],
  providers: [
    UserService,
    ReviewService,
    StatisticsService
  ]
})
export class UserModule { }
