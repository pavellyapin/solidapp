import { Component, OnInit, Input} from '@angular/core';
import { NavigationService } from 'src/app/services/navigation/navigation.service';

@Component({
  selector: 'doo-actions',
  templateUrl: './actions.component.html'
})
export class ActionsComponent implements OnInit {

  @Input() actions;
  bigScreens = new Array('lg' , 'xl' , 'md')

  constructor(public navService : NavigationService) {
    
  }

  ngOnInit() {
  }

}
