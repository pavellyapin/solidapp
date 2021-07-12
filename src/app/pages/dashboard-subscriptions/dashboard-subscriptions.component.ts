import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AdminActions from 'src/app/services/store/admin/admin.action';
import { NavigationService } from 'src/app/services/navigation/navigation.service';

@Component({
  selector: 'app-dashboard-subscriptions-page',
  templateUrl: './dashboard-subscriptions.component.html',
  styleUrls: ['./dashboard-subscriptions.component.scss']
})
export class DashboardSubscriptionsComponent implements OnInit {


  constructor(private store: Store<{}>, private navService : NavigationService) {
  }

  ngOnInit() {
    
  }
 
  ngOnDestroy(): void {
    
  }

}
