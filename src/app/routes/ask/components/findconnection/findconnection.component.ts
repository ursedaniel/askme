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
    this.getConnections();
  }

  getConnections() {
    this.ls.update(new LoaderModel(true, null));
    this.us.getConnections(localStorage.getItem('categoryName')).subscribe(
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
    this.router.navigateByUrl('/user/account?user=' + username);
  }


}
