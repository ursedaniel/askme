import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../routes/auth/services/auth.service";

@Component({
  selector: 'app-connectionmodal',
  templateUrl: './connectionmodal.component.html',
  styleUrls: ['./connectionmodal.component.scss']
})
export class ConnectionmodalComponent implements OnInit {

  @Output() notify = new EventEmitter();
  @Input() visible: boolean;
  @Input() visible2: boolean;
  @Input() conn: any;
  visibleAnimate: boolean = true;

  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit() {
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide(false);
    }
  }

  hide(value){
    this.notify.emit(value);
  }

  closeConnection() {
    this.auth.socket.emit('cancelstream', this.conn);
    this.auth.socket.open();
    this.hide(false);
  }

  startStream() {
    this.router.navigateByUrl('/stream?connection1=' +  window.btoa(this.conn.conn) + '&connection2=' + window.btoa(this.conn.username));
    this.hide(false);
  }
}
