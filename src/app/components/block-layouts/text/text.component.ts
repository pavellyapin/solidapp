import { Component, OnInit, Input} from '@angular/core';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { UtilitiesService } from 'src/app/services/util/util.service';

@Component({
  selector: 'doo-text-block',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextBlockComponent implements OnInit {

  @Input() block;
  @Input() resolution;
  
  constructor(public navService : NavigationService,public utils : UtilitiesService) {
    
  }

  ngOnInit() {
    //console.log('post',this.post);
  }

}
