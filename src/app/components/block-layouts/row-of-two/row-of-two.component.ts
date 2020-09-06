import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'doo-row-of-two',
  templateUrl: './row-of-two.component.html',
  styleUrls: ['./row-of-two.component.scss']
})
export class RowOfTwoPostComponent implements OnInit {

  @Input() block;

  constructor() {
    
  }

  ngOnInit() {
    //console.log('split',this.post);
  }

}
