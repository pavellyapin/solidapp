import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'doo-row-of-three',
  templateUrl: './row-of-three.component.html',
  styleUrls: ['./row-of-three.component.scss']
})
export class RowOfThreePostComponent implements OnInit {

  @Input() block;

  constructor() {
    
  }

  ngOnInit() {
    //console.log('split',this.post);
  }

}
