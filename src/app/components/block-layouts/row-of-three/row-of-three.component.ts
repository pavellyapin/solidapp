import { Component, OnInit, Input } from '@angular/core';
import { UtilitiesService } from 'src/app/services/util/util.service';

@Component({
  selector: 'doo-row-of-three',
  templateUrl: './row-of-three.component.html',
  styleUrls: ['./row-of-three.component.scss']
})
export class RowOfThreePostComponent implements OnInit {

  @Input() block;
  @Input() resolution;

  constructor(public utils : UtilitiesService) {
    
  }

  ngOnInit() {
    //console.log('split',this.post);
  }

}
