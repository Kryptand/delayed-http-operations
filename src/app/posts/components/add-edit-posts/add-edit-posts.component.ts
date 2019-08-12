import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Post } from '../../models/post'
import { FormGroup, FormControl } from '@angular/forms'
const generateUUID = () => {
  var d = new Date().getTime()
  if (
    typeof performance !== 'undefined' &&
    typeof performance.now === 'function'
  ) {
    d += performance.now() //use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}
@Component({
  selector: 'kryptand-add-edit-posts',
  templateUrl: './add-edit-posts.component.html',
  styleUrls: ['./add-edit-posts.component.css'],
})
export class AddEditPostsComponent implements OnInit {
  @Input() post: Post
  @Output() updateEventTriggered: EventEmitter<Post> = new EventEmitter()
  @Output() createEventTriggered: EventEmitter<Post> = new EventEmitter()
  postForm = new FormGroup({
    id: new FormControl(),
    title: new FormControl(''),
    author: new FormControl(''),
  })
  constructor() {}
  saveEvent() {
    if (this.post && this.post.id) {
      this.updateEventTriggered.emit(this.postForm.value)
    }
    const postmodel = { ...this.postForm.value, id: generateUUID() }
    this.createEventTriggered.emit(postmodel)
  }
  ngOnInit() {
    if (this.post) {
      Object.keys(this.post).forEach(key => {
        if (this.postForm.controls[key]) {
          this.postForm.controls[key].patchValue(this.post[key])
        }
      })
    }
  }
}
