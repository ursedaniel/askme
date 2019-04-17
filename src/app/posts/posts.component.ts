import { Component, OnInit } from '@angular/core';
import {PostModel} from "../models/PostModel";
import {PostService} from "../services/post.service";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  displayedColumns: string[] = ['id', 'title', 'content'];
  public posts: Array<PostModel> = [
    {id: 0, title: 'first title', content: 'first content'},
    {id: 1, title: 'second title', content: 'second content'},
    {id: 2, title: 'third title', content: 'third content'},
    {id: 3, title: 'forth title', content: 'forth content'},
  ];

  constructor(private ps: PostService) { }

  ngOnInit() {
    // this.getPosts();
  }

  getPosts() {
    this.ps.getPost().subscribe(
      (res) => {
        this.posts = res;
      }
    )
  }

}
