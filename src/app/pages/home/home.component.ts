import { Component, OnInit } from '@angular/core';
import { ContentfulService } from 'src/app/services/contentful/contentful.service';
import { map } from 'rxjs/operators';
import { Entry } from 'contentful';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {


  homePageContent : any;
  posts : Entry<any>[];

  constructor(private contentful : ContentfulService) {
    
  }

  ngOnInit() {
      this.contentful.getPage('home').pipe(map((page)=> {
          this.homePageContent = page;
            if (this.homePageContent) {
              this.contentful.getPostsForPage(this.homePageContent.sys.id).pipe(map((posts)=>{
                this.posts = posts;
                console.log('posts' , this.posts)
              })).subscribe();
            }
      })).subscribe();
  }

}
