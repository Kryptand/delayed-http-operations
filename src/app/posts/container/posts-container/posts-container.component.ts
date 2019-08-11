import { Component, OnInit } from "@angular/core";
import { Post } from "../../models/post";
import { PostsService } from "./../../services/post.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-posts-container",
  templateUrl: "./posts-container.component.html",
  styleUrls: ["./posts-container.component.css"],
  providers:[PostsService]
})
export class PostsContainerComponent implements OnInit {
  posts$: Observable<Post[]>;
  constructor(private postService: PostsService) {}
  selectedPost:Post;

  ngOnInit() {
    this.postService.loadPosts();
    this.posts$ = this.postService.posts$;
  }
  savePost(post) {
    this.postService.savePost(post);
  }
  updatePost(post) {
    this.postService.updatePost(post);
  }
  deletePost(id) {
    this.postService.deletePost(id);
  }
  revertDelete(id){
    this.postService.revert(id);
  }
  setCurrentItem(item){
    this.selectedPost=item;
  }
  executeChanges(){
    this.postService.execute();
  }
}
