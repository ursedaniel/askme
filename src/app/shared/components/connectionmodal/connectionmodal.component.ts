import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";

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

  constructor(private router: Router) { }

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

  startStream() {
    this.router.navigateByUrl('/stream?connection1=' +  window.btoa(this.conn.conn) + '&connection2=' + window.btoa(this.conn.username));
    this.hide(false);
  }
}
