import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'doo-full-width-img-background-post',
  templateUrl: './full-width-img-background.component.html',
  styleUrls: ['./full-width-img-background.component.scss']
})
export class FullWidthImgBackgroundPostComponent implements OnInit {

  @Input() post;

  constructor() {
    
  }

  ngOnInit() {
    console.log('post',this.post);
  }

}
