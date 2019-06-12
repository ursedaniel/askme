import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularAgoraRtcService, Stream} from 'angular-agora-rtc';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../auth/services/auth.service";

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss']
})
export class StreamComponent implements OnInit, OnDestroy {

  localStream: Stream;
  remoteCalls: any = [];
  streamOff: boolean;
  isLoading: boolean;
  user1: string;
  user2: string;
  currentUser: string;

  constructor(
    private agoraService: AngularAgoraRtcService,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {
    this.agoraService.createClient();
    this.user1 = window.atob(this.route.snapshot.queryParams["connection1"]);
    this.user2 = window.atob(this.route.snapshot.queryParams["connection2"]);
    this.currentUser = localStorage.getItem('username');
  }

  ngOnInit() {
  }


  startCall() {
    this.isLoading = true;
    this.auth.socket.emit('stream', {
      token: localStorage.getItem('token'),
      user1: this.user1,
      user2: this.user2,
    });
    this.auth.socket.on('startstream', data => {

      this.agoraService.client.join(null, '1000', null, (uid) => {
        this.localStream = this.agoraService.createStream(uid, true, null, null, true, false);
        this.localStream.setVideoProfile('720p_3');
        this.subscribeToStreams();
      });
    });

    this.auth.socket.on('hostcancelstream', data => {
      alert('canceled stream');
      this.isLoading = false;
    });
    this.auth.socket.open();
  }

  private subscribeToStreams() {
    this.localStream.on('accessAllowed', () => {
      console.log('accessAllowed');
    });
    // The user has denied access to the camera and mic.
    this.localStream.on('accessDenied', () => {
      console.log('accessDenied');
    });

    this.localStream.init(() => {
      console.log('getUserMedia successfully');
      this.localStream.play('my-stream');
      this.agoraService.client.publish(this.localStream, function (err) {
        console.log('Publish local stream error: ' + err);
      });
      this.agoraService.client.on('stream-published', function (evt) {
        console.log('Publish local stream successfully');
      });
    }, function (err) {
      console.log('getUserMedia failed', err);
    });

    this.agoraService.client.on('error', (err) => {
      console.log('Got error msg:', err.reason);
      if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
        this.agoraService.client.renewChannelKey('', () => {
          console.log('Renew channel key successfully');
        }, (err) => {
          console.log('Renew channel key failed: ', err);
        });
      }
    });

    this.agoraService.client.on('stream-added', (evt) => {
      const stream = evt.stream;
      this.agoraService.client.subscribe(stream, (err) => {
        console.log('Subscribe stream failed', err);
      });
    });

    this.agoraService.client.on('stream-subscribed', (evt) => {
      const stream = evt.stream;
      if (!this.remoteCalls.includes(`agora_remote${stream.getId()}`)) {
        this.remoteCalls.push(`agora_remote${stream.getId()}`);
      }
      setTimeout(() => {
        stream.play(`agora_remote${stream.getId()}`);
        this.isLoading = false;
        this.streamOff = true;
        if (localStorage.getItem('username') == this.user2)
          this.auth.socket.emit('logstream', {
            token: localStorage.getItem('token'),
            user1: this.user1,
            user2: this.user2,
          });
      }, 2000);
    });

    this.agoraService.client.on('stream-removed', (evt) => {
      const stream = evt.stream;
      stream.stop();
      this.remoteCalls = this.remoteCalls.filter(call => call !== `#agora_remote${stream.getId()}`);
      console.log(`Remote stream is removed ${stream.getId()}`);
    });

    this.agoraService.client.on('peer-leave', (evt) => {
      const stream = evt.stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = this.remoteCalls.filter(call => call === `#agora_remote${stream.getId()}`);
        console.log(`${evt.uid} left from this channel`);
      }
    });
  }

  ngOnDestroy() {
    // this.auth.socket.emit('closestream', localStorage.getItem('token'));
    this.leave();
  }

  leave() {
    this.agoraService.client.leave(() => {
      console.log("Leavel channel successfully");
    }, (err) => {
      console.log("Leave channel failed");
    });
    this.auth.socket.emit('endstreamlog', {
      token: localStorage.getItem('token'),
      user1: this.user1,
      user2: this.user2,
    });
  }

}
