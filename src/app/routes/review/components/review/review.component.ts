import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReviewService} from "../../services/review.service";
import {ReviewModel} from "../../models/ReviewModel";

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {

  user1: string;
  user2: string;
  currentUser: string;
  stars = [
    {value: 1, checked: false, hovered: false, class: 'far fa-star'},
    {value: 2, checked: false, hovered: false, class: 'far fa-star'},
    {value: 3, checked: false, hovered: false, class: 'far fa-star'},
    {value: 4, checked: false, hovered: false, class: 'far fa-star'},
    {value: 5, checked: false, hovered: false, class: 'far fa-star'},
  ];
  color: any;
  checkedStar: number;
  reviewForm: FormGroup;
  review: string = '';
  reviewModel: ReviewModel = new ReviewModel;

  constructor(
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private rs: ReviewService,
    private router: Router
  ) {
    this.user1 = window.atob(this.route.snapshot.queryParams["connection1"]);
    this.user2 = window.atob(this.route.snapshot.queryParams["connection2"]);
    this.currentUser = localStorage.getItem('username');
  }

  ngOnInit() {
    this.reviewForm = this._formBuilder.group({
      review: ['', Validators.required]
    });
  }

  changeStyle($event, star, index) {
    if ($event.type == 'mouseover') {
      if (!star.hovered) {
        for (let i = 0; i <= index; i++) {
          this.stars[i].hovered = true;
          if (index == 0)
            this.stars[i].class = 'far fa-star star-hovered first';
          else if (index == 1)
            this.stars[i].class = 'far fa-star star-hovered second';
          else if (index == 2)
            this.stars[i].class = 'far fa-star star-hovered third';
          else if (index == 3)
            this.stars[i].class = 'far fa-star star-hovered fourth';
          else if (index == 4)
            this.stars[i].class = 'far fa-star star-hovered fifth';
        }
        for (let i = index + 1; i < this.stars.length; i++) {
          this.stars[i].hovered = false;
          this.stars[i].class = 'far fa-star'
        }
      }
    } else {
      if (!star.checked) {
        for (let i = 0; i < this.stars.length; i++) {
          this.stars[i].hovered = false;
          this.stars[i].class = 'far fa-star'
        }
      }
    }
  }

  chooseStar(star, i) {
    for (let i = 0; i < this.stars.length; i++) {
      this.stars[i].checked = false;
    }
    star.checked = !star.checked;
    this.checkedStar = star.value;
    this.changeStyle({type: 'mouseover'}, star, i);
  }

  reviewUser() {
    this.reviewModel.review = this.review;
    this.reviewModel.rating = this.checkedStar;
    if (this.currentUser == this.user1) {
      this.reviewModel.username1 = this.user1;
      this.reviewModel.username2 = this.user2;
    } else {
      this.reviewModel.username1 = this.user2;
      this.reviewModel.username2 = this.user1;
    }
    this.reviewModel.date = new Date();
    this.rs.reviewUser(this.reviewModel).subscribe((success)=> {
      console.log(success);
    })
  }


}
