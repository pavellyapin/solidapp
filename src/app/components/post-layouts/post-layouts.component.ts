import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'doo-post-layouts',
  templateUrl: './post-layouts.component.html',
})
export class PostLayoutComponent implements OnInit {

  @Input() post;

  constructor() {
    
  }

  ngOnInit() {
      //console.log('layout' , this.post);
  }

}
