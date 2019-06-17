import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import * as io from 'socket.io-client';
import {ReviewModel} from "../models/ReviewModel";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private reviewAPI = 'http://localhost:3000/api/reviews/';
  socket: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.socket = io('http://localhost:3000');
  }

  reviewUser(reviewModel: ReviewModel) {
    return this.http.post<{ mesasge: string }>(this.reviewAPI, reviewModel);
  }

  getReviews() {
    return this.http.get<Array<ReviewModel>>(this.reviewAPI);
  }

  getOtherReviews(username) {
    return this.http.get<Array<ReviewModel>>(this.reviewAPI + '?username=' + username);
  }
}
