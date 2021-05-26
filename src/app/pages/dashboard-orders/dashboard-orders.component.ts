import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AdminActions from 'src/app/services/store/admin/admin.action';

@Component({
  selector: 'app-dashboard-orders-page',
  templateUrl: './dashboard-orders.component.html',
  styleUrls: ['./dashboard-orders.component.scss']
})
export class DashboardOrdersComponent implements OnInit {


  constructor(private store: Store<{}>) {
                
  }

  ngOnInit() {
    
  }

  ngOnDestroy(): void {
    
  }

}
