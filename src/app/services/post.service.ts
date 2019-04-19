import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from "rxjs/operators";
import {PostModel} from "../models/PostModel";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) {
  }

  getPosts() {
    return this.http.get<PostModel[]>('http://localhost:3000/api/posts');
  }

  AddPost(form: Object) {
    return this.http.post<{message: string}>('http://localhost:3000/api/post', form);
  }
}
