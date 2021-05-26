import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
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

export interface CartData {
  status : string;
  id: string;
  name: string;
  email: string;
  uid:string;
  date: string;
  itemCount: string;
}

@Component({
  selector: 'app-dashboard-carts-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class DashboardCartsOverviewComponent implements OnInit {


  admin$: Observable<any>;
  AdminSubscription: Subscription;
  DeleteCartsSubscription : Subscription;
  SettingsSubscription: Subscription;
  settings$: Observable<SettingsState>;
  resolution: any;

  carts: any;
  cartFilter: any = 'all';
  displayedColumns: string[] = ['select','id','name', 'date','itemCount'];
  
  dataSource: MatTableDataSource<any>;

  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private store: Store<{ settings: SettingsState, admin: AdminState }>,
    private navSerivce: NavigationService,
    private router: Router,
    private _actions$: Actions,
    private dialog: MatDialog,
    public utilService: UtilitiesService,
    private changeDetectorRef: ChangeDetectorRef,) {

    this.admin$ = store.pipe(select('admin','carts'));
    this.settings$ = store.pipe(select('settings'));
  }

  ngOnInit() {
      this.AdminSubscription = this._actions$.pipe(ofType(AdminActions.SuccessLoadCartsAction)).subscribe((result) => {
        this.carts = result.payload;
        const carts = Array.from(result.payload, cart => this.createCart(cart));
        this.dataSource = new MatTableDataSource(carts);
        this.dataSource.paginator = this.paginator;
        this.navSerivce.finishLoading();
      });

      this.SettingsSubscription = this.settings$
      .pipe(
        map(x => {
          this.resolution = x.resolution;
        })
      )
      .subscribe();

      this.DeleteCartsSubscription = this._actions$.pipe(ofType(AdminActions.SuccessDeleteCartsAction)).subscribe((result) => {
        this.selection.clear();
        this.store.dispatch(AdminActions.BeginLoadCartsAction());
      });
  }

  createCart(cart, filter?): CartData {
    if (!filter || filter == 'all' || cart.status == filter) {
      return {
        id: cart.cartId,
        status : cart.status,
        uid : cart.uid,
        name: cart.personalInfo ? cart.personalInfo.firstName + ' ' + cart.personalInfo.lastName : 'Guest User',
        email: cart.personalInfo ? cart.personalInfo.email : 'Guest User',
        date : cart.date,
        itemCount: cart.itemCount,
      };
    }
  }

  filterCarts(type) {
    this.cartFilter = type;
    let carts = Array.from(this.carts, cart => this.createCart(cart, type));
    carts = carts.filter(function (element) {
      return element !== undefined;
    });
    this.dataSource = new MatTableDataSource(carts);
    this.dataSource.paginator = this.paginator;

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.changeDetectorRef.detectChanges();
  }

  goToCart(cartId,uid) {
    this.navSerivce.startLoading();
    this.router.navigateByUrl('store/carts/' + cartId + '/' + (uid ? uid : '') )
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
    let config;
    if (this.utilService.bigScreens.includes(this.resolution)) {
      config = {
        height: '40%',
        width: '60vw',
        data: { count: this.selection.selected.length }
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
        this.store.dispatch(AdminActions.BeginDeleteCartsAction({payload : this.selection.selected}));
        console.log('The dialog was closed' , result);
      }
    });
  }

  ngOnDestroy(): void {
    this.AdminSubscription.unsubscribe();
    this.SettingsSubscription.unsubscribe();
    this.DeleteCartsSubscription.unsubscribe();
  }

}
