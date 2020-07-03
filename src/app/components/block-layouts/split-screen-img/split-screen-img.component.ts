import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'doo-split-screen-img',
  templateUrl: './split-screen-img.component.html',
  styleUrls: ['./split-screen-img.component.scss']
})
export class SplitScreenImagePostComponent implements OnInit {

  @Input() block;

  constructor() {
    
  }

  ngOnInit() {
    //console.log('split',this.post);
  }

}
