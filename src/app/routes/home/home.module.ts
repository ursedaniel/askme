import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import {routing} from './routes/routes';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    routing
  ]
})
export class HomeModule { }
