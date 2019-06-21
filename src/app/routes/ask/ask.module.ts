import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './components/categories/categories.component';
import {routing} from './routes/routes';
import {MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatStepperModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FindconnectionComponent } from './components/findconnection/findconnection.component';
import {UserService} from "../user/services/user.service";
import {StatisticsService} from "../statistics/services/statistics.service";

@NgModule({
  declarations: [CategoriesComponent, FindconnectionComponent],
  imports: [
    CommonModule,
    routing,
    MatStepperModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  providers: [
    UserService,
    StatisticsService
  ]
})
export class AskModule { }
