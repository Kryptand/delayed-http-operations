import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { PostsModule } from "./../posts.module";
import { Post } from "../models/post";
import { Subject, Observable } from "rxjs";
import { DelayedHttpOperationsService } from "./../../../../projects/delayed-http-operations/src/lib/services/delayed-http-operations.service";

@Injectable()
export class PostsService {
  constructor(
    private httpClient: HttpClient,
    private delay: DelayedHttpOperationsService
  ) {}
  private postsSub$: Subject<Post[]> = new Subject();
  posts$: Observable<Post[]> = this.postsSub$.asObservable();
  private readonly FEATURE_KEY = "posts";

  getDelayedOps(){
    return this.delay.delayedOperations;
  }
  savePost(post: Post) {
    if (post) {
      this.delay.save(this.FEATURE_KEY, "http://localhost:3000/posts", post);
      this.postsSub$.subscribe(currentposts =>
        this.postsSub$.next([...currentposts, post])
      );
    }
  }
  updatePost(post: Post) {
    if (post) {
      this.delay.update(this.FEATURE_KEY, "http://localhost:3000/posts", post);
    }
    this.postsSub$.subscribe(currentposts =>
      this.postsSub$.next([...currentposts, post])
    );
  }
  deletePost(id: string) {
    if (id) {
      this.delay.delete(this.FEATURE_KEY, "http://localhost:3000/posts", id);
      this.postsSub$.subscribe(currentposts => {
        const post = currentposts.find(x => x.id === id);
        post.deleted = true;
        const posts = currentposts.filter(x => x.id !== id);
        this.postsSub$.next([...posts, post]);
      });
    }
  }
  execute(): Observable<any> {
    return this.delay.execute(this.FEATURE_KEY);
  }
  async loadPosts() {
    const posts = await this.httpClient
      .get<Post[]>("http://localhost:3000/posts")
      .toPromise();
    this.postsSub$.next(posts);
  }
  revert(id) {
    this.postsSub$.subscribe(currentposts => {
      const post = currentposts.find(x => x.id === id);
      post.deleted = false;
      const posts = currentposts.filter(x => x.id !== id);
      this.postsSub$.next([...posts, post]);
    });
    this.delay.revokeDelete(this.FEATURE_KEY, id);
  }
}
