import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AdminActions from 'src/app/services/store/admin/admin.action';
import { NavigationService } from 'src/app/services/navigation/navigation.service';

@Component({
  selector: 'app-dashboard-customers-page',
  templateUrl: './dashboard-customers.component.html',
  styleUrls: ['./dashboard-customers.component.scss']
})
export class DashboardCustomersComponent implements OnInit {


  constructor(private store: Store<{}>, private navService : NavigationService) {
  }

  ngOnInit() {
    this.store.dispatch(AdminActions.BeginLoadCustomersAction());
  }
 
  ngOnDestroy(): void {
    
  }

}
