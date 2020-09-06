import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'doo-card-post',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardPostComponent implements OnInit {

  @Input() block;

  constructor() {
    
  }

  ngOnInit() {
    //console.log('split',this.post);
  }

}
