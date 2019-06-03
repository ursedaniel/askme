import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyprofileComponent } from './components/myprofile/myprofile.component';
import {routing} from './routes/routes';
import {UserService} from "./services/user.service";
import {MatButtonModule, MatFormFieldModule, MatInputModule} from "@angular/material";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [MyprofileComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    routing
  ],
  providers: [
    UserService
  ]
})
export class UserModule { }
