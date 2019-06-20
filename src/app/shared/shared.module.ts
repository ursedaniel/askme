import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeaderComponent} from './components/header/header.component';
import {MatButtonModule, MatCardModule, MatChipsModule, MatMenuModule, MatToolbarModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {LoaderComponent} from "./components/loader/loader.component";
import { ConnectionmodalComponent } from './components/connectionmodal/connectionmodal.component';
import {NotificationService} from "./services/notification.service";
import {UserService} from "../routes/user/services/user.service";

@NgModule({
  declarations: [
    HeaderComponent,
    LoaderComponent,
    ConnectionmodalComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    RouterModule,
    MatMenuModule,
    MatChipsModule,
    MatCardModule
  ],
  exports: [
    HeaderComponent,
    LoaderComponent,
    ConnectionmodalComponent
  ],
  providers: [
    NotificationService,
    UserService
  ]
})
export class SharedModule { }
