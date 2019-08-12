/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { DebugElement } from '@angular/core'

import { AddEditPostsComponent } from './add-edit-posts.component'

describe('AddEditPostsComponent', () => {
  let component: AddEditPostsComponent
  let fixture: ComponentFixture<AddEditPostsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditPostsComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditPostsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
