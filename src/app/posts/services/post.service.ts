import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { PostsModule } from './../posts.module'
import { Post } from '../models/post'
import { Subject, Observable, BehaviorSubject } from 'rxjs'
import { DelayedHttpOperationsService } from './../../../../projects/delayed-http-operations/src/lib/services/delayed-http-operations.service'

@Injectable()
export class PostsService {
  constructor(
    private httpClient: HttpClient,
    private delay: DelayedHttpOperationsService
  ) {}
  private postsSub$: BehaviorSubject<Post[]> = new BehaviorSubject([])
  posts$: Observable<Post[]> = this.postsSub$.asObservable()
  public FEATURE_KEY: BehaviorSubject<string> = new BehaviorSubject('posts')

  getDelayedOps() {
    return this.delay.delayedOperations
  }
  savePost(post: Post) {
    if (post) {
      this.delay.save(
        this.FEATURE_KEY.value,
        'http://localhost:3000/posts',
        post
      )
      this.postsSub$.next([...this.postsSub$.value, post])
    }
  }
  updatePost(post: Post) {
    if (post) {
      this.delay.update(
        this.FEATURE_KEY.value,
        'http://localhost:3000/posts',
        post
      )
    }
    this.postsSub$.next([...this.postsSub$.value, post])
  }
  deletePost(id: string) {
    if (id) {
      this.delay.delete(
        this.FEATURE_KEY.value,
        'http://localhost:3000/posts',
        id
      )
      const post = this.postsSub$.value.find(x => x.id === id)
      post.deleted = true
      const posts = this.postsSub$.value.filter(x => x.id !== id)
      this.postsSub$.next([...posts, post])
    }
  }
  execute(): Observable<any> {
    return this.delay.execute(this.FEATURE_KEY.value)
  }
  async loadPosts() {
    const posts = await this.httpClient
      .get<Post[]>('http://localhost:3000/posts')
      .toPromise()
    this.postsSub$.next(posts)
  }
  revert(id) {
    const post = this.postsSub$.value.find(x => x.id === id)
    post.deleted = false
    const posts = this.postsSub$.value.filter(x => x.id !== id)
    this.postsSub$.next([...posts, post])

    this.delay.revokeDelete(this.FEATURE_KEY.value, id)
  }
}
