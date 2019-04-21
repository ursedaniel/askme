import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatButtonModule, MatCardModule, MatInputModule, MatTableModule, MatToolbarModule} from "@angular/material";
import {FormsModule} from "@angular/forms";
import {PostService} from "./routes/posts/services/post.service";
import {HttpClientModule} from "@angular/common/http";
import {RouterModule} from '@angular/router';
import {SharedModule} from './shared/shared.module';
import {routing} from './routes';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatInputModule,
    HttpClientModule,
    RouterModule,
    SharedModule,
    routing
  ],
  providers: [PostService],
  bootstrap: [AppComponent]
})
export class AppModule { }
