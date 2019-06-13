import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewComponent } from './components/review/review.component';
import {routing} from './routes/routes';

@NgModule({
  declarations: [ReviewComponent],
  imports: [
    CommonModule,
    routing
  ]
})
export class ReviewModule { }
