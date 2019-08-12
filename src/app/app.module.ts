import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { PostsModule } from './posts/posts.module'
import { HttpClientModule } from '@angular/common/http'
import { DelayedHttpOperationsService } from 'projects/delayed-http-operations/src/lib/services/delayed-http-operations.service'

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, PostsModule, HttpClientModule],
  providers: [DelayedHttpOperationsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
