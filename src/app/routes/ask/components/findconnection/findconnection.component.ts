import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../user/services/user.service";
import {UserModel} from "../../../user/models/UserModel";
import {LoaderService} from "../../../../shared/services/loader.service";
import {LoaderModel} from "../../../../shared/models/LoaderModel";
import {Router} from "@angular/router";

@Component({
  selector: 'app-findconnection',
  templateUrl: './findconnection.component.html',
  styleUrls: ['./findconnection.component.scss']
})
export class FindconnectionComponent implements OnInit {

  connections: Array<UserModel> = [];
  range = [];

  constructor(
    private us: UserService,
    private ls: LoaderService,
    private router: Router
  ) {
  }

  ngOnInit() {
    for (var i = 0; i < 5; i++) {
      this.range.push(i);
    }
  }

  getConnections() {
    this.ls.update(new LoaderModel(true, null));
    this.us.getConnections().subscribe(
      (response) => {
        this.connections = response.connections;
        this.ls.update(null);
      },
      (error) => {
        this.ls.update(null);
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

  connectUser(username) {
    let myusername = window.btoa(localStorage.getItem('username'));
    this.router.navigateByUrl('/stream?connection1=' + myusername + '&connection2=' + window.btoa(username));
  }


}
