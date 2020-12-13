import { Component, OnInit, Input } from '@angular/core';
import { UtilitiesService } from 'src/app/services/util/util.service';

@Component({
  selector: 'doo-row-of-two',
  templateUrl: './row-of-two.component.html',
  styleUrls: ['./row-of-two.component.scss']
})
export class RowOfTwoPostComponent implements OnInit {

  @Input() block;
  @Input() resolution;

  constructor(public utils : UtilitiesService) {
    
  }

  ngOnInit() {
    //console.log('split',this.post);
  }

}
