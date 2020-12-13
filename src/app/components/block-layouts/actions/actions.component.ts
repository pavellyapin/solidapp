import { Component, OnInit, Input} from '@angular/core';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { UtilitiesService } from 'src/app/services/util/util.service';

@Component({
  selector: 'doo-actions',
  templateUrl: './actions.component.html'
})
export class ActionsComponent implements OnInit {

  @Input() actions;
  @Input() stacked;
  @Input() resolution;

  constructor(public navService : NavigationService,public utils : UtilitiesService) {
    
  }

  ngOnInit() {
  }

  navigate(cta) {
    if (cta.fields.action) {
      this.navService.ctaClick(cta.fields.action)
    } else {
      this.navService.navigateExternalURL(cta.fields.externalUrl);
    }
  }
}
