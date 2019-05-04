import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {PostService} from "./routes/posts/services/post.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {SharedModule} from './shared/shared.module';
import {routing} from './routes';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthInterceptor} from './routes/auth/services/auth-interceptor';
import {AuthGuard} from './routes/auth/guards/auth.guard';
import {AuthService} from './routes/auth/services/auth.service';

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
  providers: [
    [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
    PostService,
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
