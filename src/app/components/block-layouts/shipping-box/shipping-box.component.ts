import { Component, OnInit, Input} from '@angular/core';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { UtilitiesService } from 'src/app/services/util/util.service';

@Component({
  selector: 'doo-shipping-box',
  templateUrl: './shipping-box.component.html',
  styleUrls: ['./shipping-box.component.scss']
})
export class ShippingBoxComponent implements OnInit {

  @Input() personalInfo;
  @Input() address;
  @Input() shipping;
  @Input() editable;
  @Input() simple : boolean;
  
  constructor(public navService : NavigationService,public utils : UtilitiesService) {
    
  }

  ngOnInit() {
    //console.log('post',this.post);
  }

}
