import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {routing} from './routes/routes';
import {MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatTableModule} from '@angular/material';
import {PostsComponent} from './components/posts/posts.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [PostsComponent],
  imports: [
    CommonModule,
    routing,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    FormsModule,
  ]
})
export class PostsModule { }
