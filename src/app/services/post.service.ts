import { Injectable } from '@angular/core';
import{HttpClient} from '@angular/common/http';
import {map} from "rxjs/operators";
import {PostModel} from "../models/PostModel";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor( private http : HttpClient) {
  }

  getPost() {
    return this.http.get('http://localhost:3000/api/posts').pipe(map(response => <PostModel[]>response));
  }
}
