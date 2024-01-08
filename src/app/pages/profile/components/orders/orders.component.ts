import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import UserState from 'src/app/services/store/user/user.state';
import { map } from 'rxjs/operators';
import { OrderItem } from 'src/app/services/store/user/user.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { sortOrders } from 'src/app/components/pipes/pipes';
import { UtilitiesService } from 'src/app/services/util/util.service';
import SettingsState from 'src/app/services/store/settings/settings.state';

@Component({
  selector: 'doo-user-orers',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  orders$: Observable<Array<OrderItem>>;
  UserSubscription: Subscription;
  orders: Array<OrderItem>;
  dataSource: any;
  displayedColumns: string[] = ['id', 'date', 'name', 'total', 'itemCount'];

  SettingsSubscription: Subscription;
  settings$: Observable<SettingsState>;
  resolution: any;
  //displayedColumns: string[] = ['id', 'date', 'status', 'total'];

  constructor(store: Store<{ user: UserState, settings: SettingsState }>, public utilService: UtilitiesService) {
    this.orders$ = store.pipe(select('user', 'orders'));
    this.settings$ = store.pipe(select('settings'))
  }


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  ngOnInit() {
    this.UserSubscription = this.orders$
      .pipe(
        map(x => {
          console.log(x);
          //this.orderItems = x.slice(0);
          //this.orderItems.sort(sortOrders);
          //this.dataSource = new MatTableDataSource<any>(this.orderItems);

          this.orders = x;
          const orders = Array.from(x, order => this.createOrder(order));
          this.dataSource = new MatTableDataSource(orders);
          this.dataSource.paginator = this.paginator;
        })
      )
      .subscribe();

    this.SettingsSubscription = this.settings$
      .pipe(
        map(x => {
          this.resolution = x.resolution;
        })
      )
      .subscribe();
  }

  createOrder(order, filter?): OrderItem {
    return {
      id: order.orderId,
      status: order.status,
      workflow: order.workflow,
      date: order.date
    };
  }


  ngOnDestroy() {
    this.UserSubscription.unsubscribe();
    this.SettingsSubscription.unsubscribe();
  }

}
