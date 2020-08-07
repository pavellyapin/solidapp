import { Component, OnInit, Input } from '@angular/core';
import { NavigationService } from 'src/app/services/navigation/navigation.service';

@Component({
  selector: 'doo-split-screen-img',
  templateUrl: './split-screen-img.component.html',
  styleUrls: ['./split-screen-img.component.scss']
})
export class SplitScreenImagePostComponent implements OnInit {

  @Input() block;

  constructor(public navService : NavigationService) {
    
  }

  ngOnInit() {
    //console.log('split',this.post);
  }

}
