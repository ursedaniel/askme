import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyprofileComponent } from './components/myprofile/myprofile.component';
import {routing} from './routes/routes';

@NgModule({
  declarations: [MyprofileComponent],
  imports: [
    CommonModule,
    routing
  ]
})
export class UserModule { }
