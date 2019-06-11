import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AgoraConfig, AngularAgoraRtcModule} from 'angular-agora-rtc';
import { StreamComponent } from './components/stream/stream.component';
import {routing} from './routes/routes';
import {MatButtonModule, MatProgressSpinnerModule} from '@angular/material';

const agoraConfig: AgoraConfig = {
  AppID: 'fed2cfa365604af79c0cbe062495dabe',
};

@NgModule({
  declarations: [StreamComponent],
  imports: [
    CommonModule,
    AngularAgoraRtcModule.forRoot(agoraConfig),
    routing,
    MatProgressSpinnerModule,
    MatButtonModule
  ]
})
export class StreamModule { }
