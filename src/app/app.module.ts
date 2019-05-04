import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {PostService} from "./routes/posts/services/post.service";
import {HttpClientModule} from "@angular/common/http";
import {RouterModule} from '@angular/router';
import {SharedModule} from './shared/shared.module';
import {routing} from './routes';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    SharedModule,
    BrowserAnimationsModule,
    routing
  ],
  providers: [PostService],
  bootstrap: [AppComponent]
})
export class AppModule { }
