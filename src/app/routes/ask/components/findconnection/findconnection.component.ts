import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../user/services/user.service";
import {UserModel} from "../../../user/models/UserModel";

@Component({
  selector: 'app-findconnection',
  templateUrl: './findconnection.component.html',
  styleUrls: ['./findconnection.component.scss']
})
export class FindconnectionComponent implements OnInit {

  connections: Array<UserModel> = [];
  range = [];

  constructor(private us: UserService) {
  }

  ngOnInit() {
    for (var i = 0; i < 5; i++) {
      this.range.push(i);
    }
    this.getConnections();
  }

  getConnections() {
    this.us.getConnections().subscribe(
      (response) => {
        this.connections = response.connections;
      }
    );
  }

  public isMarked = (index, conIndex) => {
      if (this.connections[conIndex].rating >= index + 1) {
        return 'fas fa-star';
      } else if (this.connections[conIndex].rating > index && this.connections[conIndex].rating < index + 1) {
        return 'fas fa-star-half-alt';
      } else {
        return 'far fa-star';
      }
  };

}
