import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AdminActions from 'src/app/services/store/admin/admin.action';
import { NavigationService } from 'src/app/services/navigation/navigation.service';

@Component({
  selector: 'app-dashboard-carts-page',
  templateUrl: './dashboard-carts.component.html',
  styleUrls: ['./dashboard-carts.component.scss']
})
export class DashboardCartsComponent implements OnInit {


  constructor(private store: Store<{}>, private navService : NavigationService) {
  }

  ngOnInit() {
    
  }
 
  ngOnDestroy(): void {
    
  }

}
