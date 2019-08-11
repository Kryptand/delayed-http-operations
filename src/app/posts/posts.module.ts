import { NgModule } from '@angular/core';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { AddEditPostsComponent } from './components/add-edit-posts/add-edit-posts.component';
import { PostsContainerComponent } from './container/posts-container/posts-container.component';
import { CommonModule } from '@angular/common';
@NgModule({
  imports: [ReactiveFormsModule,FormsModule,CommonModule],
  exports: [AddEditPostsComponent,PostsContainerComponent],
  declarations: [AddEditPostsComponent,PostsContainerComponent],
})
export class PostsModule { }
