/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { DebugElement } from '@angular/core'

import { PostsContainerComponent } from './posts-container.component'

describe('PostsContainerComponent', () => {
  let component: PostsContainerComponent
  let fixture: ComponentFixture<PostsContainerComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PostsContainerComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsContainerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
