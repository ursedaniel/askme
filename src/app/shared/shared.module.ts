import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeaderComponent} from './components/header/header.component';
import {MatButtonModule, MatMenuModule, MatToolbarModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {LoaderComponent} from "./components/loader/loader.component";

@NgModule({
  declarations: [
    HeaderComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    RouterModule,
    MatMenuModule
  ],
  exports: [
    HeaderComponent,
    LoaderComponent
  ]
})
export class SharedModule { }
