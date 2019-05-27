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
import {ToastrModule, ToastrService} from 'ngx-toastr';

import {SocketIoConfig, SocketIoModule} from 'ngx-socket-io';

const config: SocketIoConfig = {
  url: 'http://localhost:3000/api', options: {}
};


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
    SocketIoModule.forRoot(config),
    ToastrModule.forRoot({
      timeOut: 7000,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
      progressAnimation: 'increasing',
      progressBar: true,
    }),
    routing
  ],
  providers: [
    [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
    PostService,
    AuthService,
    AuthGuard,
    ToastrService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

