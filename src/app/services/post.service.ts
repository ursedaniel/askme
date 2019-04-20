import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {PostModel} from '../models/PostModel';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) {
  }

  getPosts() {
    return this.http.get<any>('http://localhost:3000/api/posts').pipe(map((postData => {
      return postData.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id
        }
      });
    })));
  }

  AddPost(form: Object) {
    return this.http.post<{ message: string }>('http://localhost:3000/api/post', form);
  }
}
