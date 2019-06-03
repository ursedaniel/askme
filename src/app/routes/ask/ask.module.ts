import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './components/categories/categories.component';
import {routing} from './routes/routes';
import {MatButtonModule, MatFormFieldModule, MatInputModule, MatStepperModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FindconnectionComponent } from './components/findconnection/findconnection.component';
import {UserService} from "../user/services/user.service";

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
    MatButtonModule
  ],
  providers: [
    UserService
  ]
})
export class AskModule { }
