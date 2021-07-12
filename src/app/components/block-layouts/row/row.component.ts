import { Component, OnInit, Input } from '@angular/core';
import { UtilitiesService } from 'src/app/services/util/util.service';

@Component({
  selector: 'doo-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.scss']
})
export class RowPostComponent implements OnInit {

  @Input() block;
  @Input() resolution;

  constructor(public utils : UtilitiesService) {
    
  }

  ngOnInit() {
    //console.log('split',this.post);
  }

  ngOnChanges() {
    
  }

}
