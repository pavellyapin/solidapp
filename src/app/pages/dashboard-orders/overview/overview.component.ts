import { Component, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';
import AdminState from 'src/app/services/store/admin/admin.state';
import * as AdminActions from 'src/app/services/store/admin/admin.action';
import { ofType, Actions } from '@ngrx/effects';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UtilitiesService } from 'src/app/services/util/util.service';
import SettingsState from 'src/app/services/store/settings/settings.state';

export interface OrderData {
  status : string;
  id: string;
  uid:string;
  name: string;
  email: string;
  date: string;
  itemCount: string;
  total: string;
}

@Component({
  selector: 'app-dashboard-orders-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class DashboardOrdersOverviewComponent implements OnInit {


  admin$: Observable<any>;
  AdminSubscription: Subscription;
  SettingsSubscription: Subscription;
  settings$: Observable<SettingsState>;
  resolution: any;

  orders: any;
  searchKey: any = '';
  ordersFilter: any = 'all';
  displayedColumns: string[] = ['select','id', 'date', 'name','total','itemCount'];
  dataSource: MatTableDataSource<any>;

  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private store: Store<{ settings: SettingsState,admin : AdminState}> ,
              private navSerivce : NavigationService,
              private router: Router,
              private route: ActivatedRoute,
              private _actions$: Actions,
              public utilService: UtilitiesService) {
                
                this.admin$ = store.pipe(select('admin','orders'));
                this.settings$ = store.pipe(select('settings'));
  }

  ngOnInit() {

    this.AdminSubscription = this._actions$.pipe(ofType(AdminActions.SuccessLoadOrdersAction)).subscribe((result) => {
      this.orders = result.payload;
      const orders = Array.from(result.payload, order => this.createOrder(order));
      this.dataSource = new MatTableDataSource(orders);
      this.dataSource.paginator = this.paginator;
      if(this.route.snapshot.params["uid"]) {
        this.dataSource.filter = this.route.snapshot.params["uid"];
        this.searchKey = this.route.snapshot.params["uid"];
      }
      this.navSerivce.finishLoading();
    });

    this.SettingsSubscription = this.settings$
    .pipe(
      map(x => {
        this.resolution = x.resolution;
      })
    )
    .subscribe();
  }

  createOrder(order, filter?): OrderData {
    if (!filter || filter == 'all' || order.status == filter) {
      return {
        id: order.orderId,
        status : order.status,
        uid : order.uid,
        date : order.date,
        name: order.personalInfo ? order.personalInfo.firstName + ' ' + order.personalInfo.lastName : 'Guest User',
        email: order.personalInfo ? order.personalInfo.email : 'Guest User',
        itemCount: order.itemCount,
        total: order.grandTotal
      };
    } /*else if (filter == 'registered' && customer.personalInfo) {
      return {
        id: customer.id,
        name: customer.personalInfo ? customer.personalInfo.firstName + ' ' + customer.personalInfo.lastName : 'Guest User',
        email: customer.personalInfo ? customer.personalInfo.email : 'Guest User',
        orders: customer.orders,
        total: customer.ordersTotal
      };
    } else if (filter == 'guest' && !customer.personalInfo) {
      return {
        id: customer.id,
        name: customer.personalInfo ? customer.personalInfo.firstName + ' ' + customer.personalInfo.lastName : 'Guest User',
        email: customer.personalInfo ? customer.personalInfo.email : 'Guest User',
        orders: customer.orders,
        total: customer.ordersTotal
      };
    }*/
  }

  filterOrder(type) {
    this.ordersFilter = type;
    let orders = Array.from(this.orders, order => this.createOrder(order, type));
    orders = orders.filter(function (element) {
      return element !== undefined;
    });
    this.dataSource = new MatTableDataSource(orders);
    this.dataSource.filter = this.searchKey;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  goToOrder(orderId,uid) {
    this.navSerivce.startLoading();
    this.router.navigateByUrl('store/orders/' + orderId + '/' + (uid ? uid : '') )
  }

  toggleAll($event) {
    const startIndex = this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize;
    if ($event.checked) {
      this.dataSource.filteredData.slice(startIndex, startIndex + this.dataSource.paginator.pageSize).forEach(row => {
        this.selection.select(row);
      }
      );
    } else {
      this.selection.clear();
    }
  }

  checkboxSelected($event,element) {
    if ($event.checked) {
      this.selection.select(element);
    } else {
      this.selection.deselect(element);
    }
  }

  isSelected(row) {
    return this.selection.isSelected(row)
  }
  ngOnDestroy(): void {
    this.AdminSubscription.unsubscribe();
    this.SettingsSubscription.unsubscribe();
  }

}
