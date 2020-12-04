import { Component, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import AdminState from 'src/app/services/store/admin/admin.state';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { UtilitiesService } from 'src/app/services/util/util.service';
import * as AdminActions from 'src/app/services/store/admin/admin.action';
import { ofType, Actions } from '@ngrx/effects';
import { ConfirmDeleteCartModalComponent } from '../modals/confirm-delete/confirm-delete.component';

export interface CustomerData {
  id: string;
  name: string;
  email: string;
  orders: string;
  total: string;
}

@Component({
  selector: 'app-dashboard-carts-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class DashboardCartsOverviewComponent implements OnInit {


  admin$: Observable<any>;
  AdminSubscription: Subscription;
  DeleteCustomerSubscription : Subscription;
  SettingsSubscription: Subscription;
  settings$: Observable<SettingsState>;
  resolution: any;

  customers: any;
  customerFilter: any = 'all';
  displayedColumns: string[] = ['select', 'name', 'orders', 'total'];
  dataSource: MatTableDataSource<any>;

  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private store: Store<{ settings: SettingsState, admin: AdminState }>,
    private navSerivce: NavigationService,
    private router: Router,
    private _actions$: Actions,
    private dialog: MatDialog,
    private utilService: UtilitiesService) {

    this.admin$ = store.pipe(select('admin','carts'));
    this.settings$ = store.pipe(select('settings'));
  }

  ngOnInit() {
    this.navSerivce.startLoading();
    this.AdminSubscription = this.admin$
      .pipe(
        map(x => {
          if (x) {
            this.customers = x;
            const customers = Array.from(x, customer => this.createCustomer(customer));
            this.dataSource = new MatTableDataSource(customers);
            this.dataSource.paginator = this.paginator;
            this.navSerivce.finishLoading();
          }
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

      this.DeleteCustomerSubscription = this._actions$.pipe(ofType(AdminActions.SuccessDeleteCustomersAction)).subscribe((result) => {
        this.store.dispatch(AdminActions.BeginLoadCartsAction());
      });
  }

  createCustomer(customer, filter?): CustomerData {
    if (!filter || filter == 'all') {
      return {
        id: customer.id,
        name: customer.personalInfo ? customer.personalInfo.firstName + ' ' + customer.personalInfo.lastName : 'Guest User',
        email: customer.personalInfo ? customer.personalInfo.email : 'Guest User',
        orders: customer.orders,
        total: customer.ordersTotal
      };
    } else if (filter == 'registered' && customer.personalInfo) {
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
    }
  }

  filterCustomer(type) {
    this.customerFilter = type;
    let customers = Array.from(this.customers, customer => this.createCustomer(customer, type));
    customers = customers.filter(function (element) {
      return element !== undefined;
    });
    this.dataSource = new MatTableDataSource(customers);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  goToCustomer(id) {
    this.navSerivce.startLoading();
    this.router.navigateByUrl('store/customers/' + id)
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

  confirmDeletePopUp() {

    let customersWithOrders = this.selection.selected.filter(customer=> {
      if (customer.orders) {
        return customer;
      }
    }).length;
    let config;
    if (this.utilService.bigScreens.includes(this.resolution)) {
      config = {
        height: '40%',
        width: '60vw',
        data: { count: this.selection.selected.length , withOrders: customersWithOrders }
      };
    } else {
      config = {
        position: {
          top: '0px',
          right: '0px'
        },
        height: '100%',
        width: '100vw',
        panelClass: 'full-screen-modal',
        data: { count: this.selection.selected.length }
      };
    }
    const dialogRef = this.dialog.open(ConfirmDeleteCartModalComponent,config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.navSerivce.startLoading();
        this.store.dispatch(AdminActions.BeginDeleteCustomersAction({payload : this.selection.selected}));
        console.log('The dialog was closed' , result);
      }
    });
  }

  ngOnDestroy(): void {
    this.AdminSubscription.unsubscribe();
    this.SettingsSubscription.unsubscribe();
    this.DeleteCustomerSubscription.unsubscribe();
  }

}
