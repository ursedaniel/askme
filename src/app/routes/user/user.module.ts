import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyprofileComponent } from './components/myprofile/myprofile.component';
import {routing} from './routes/routes';
import {UserService} from "./services/user.service";
import {
  MatButtonModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatTableModule
} from "@angular/material";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ReviewService} from "../review/services/review.service";

@NgModule({
  declarations: [MyprofileComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    routing,
    MatExpansionModule,
    MatTableModule
  ],
  providers: [
    UserService,
    ReviewService
  ]
})
export class UserModule { }
