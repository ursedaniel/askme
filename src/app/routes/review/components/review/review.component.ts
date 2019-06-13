import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../auth/services/auth.service";

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {

  user1: string;
  user2: string;
  currentUser: string;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {
    this.user1 = window.atob(this.route.snapshot.queryParams["connection1"]);
    this.user2 = window.atob(this.route.snapshot.queryParams["connection2"]);
    this.currentUser = localStorage.getItem('username');
  }

  ngOnInit() {
  }

}
