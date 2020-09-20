import { Component, OnInit, Input} from '@angular/core';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { UtilitiesService } from 'src/app/services/util/util.service';

@Component({
  selector: 'doo-expand-block',
  templateUrl: './expand.component.html',
  styleUrls: ['./expand.component.scss']
})
export class ExpandBlockComponent implements OnInit {

  @Input() block;
  @Input() resolution;

  expandOpen: boolean = false;
  
  constructor(public navService : NavigationService,public utils : UtilitiesService) {
    
  }

  ngOnInit() {
    //console.log('post',this.post);
  }

}
