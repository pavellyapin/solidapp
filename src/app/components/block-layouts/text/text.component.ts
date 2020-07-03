import { Component, OnInit, Input} from '@angular/core';
import { NavigationService } from 'src/app/services/navigation/navigation.service';

@Component({
  selector: 'doo-text-block',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextBlockComponent implements OnInit {

  @Input() block;
  @Input() resolution;
  bigScreens = new Array('lg' , 'xl' , 'md')

  constructor() {
    
  }

  ngOnInit() {
    //console.log('post',this.post);
  }

}
