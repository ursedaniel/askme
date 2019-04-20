import {Component, OnInit, ViewChild} from '@angular/core';
import {PostModel} from "../models/PostModel";
import {PostService} from "../services/post.service";
import {MatTable} from "@angular/material";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  @ViewChild(MatTable) table: MatTable<any>;
  displayedColumns: string[] = ['id', 'title', 'content'];
  public posts: Array<PostModel> = [];

  constructor(
    private ps: PostService
  ) {
  }

  ngOnInit() {
  }

  getPosts() {
    this.ps.getPosts().subscribe(
      (res) => {
        this.posts = res;
      }
    )
  }

  addPost(form: HTMLFormElement) {
    // @ts-ignore
    this.ps.AddPost({title: form.title.value, content: form.content.value}).subscribe(
      (res) => {
        // @ts-ignore
        this.posts.push({id: 0, content: form.content.value, title: form.title.value});
        this.table.renderRows();
      }
    )
  }
}
