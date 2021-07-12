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
import { ConfirmDeleteSubscriptionModalComponent } from '../modals/confirm-delete/confirm-delete.component';

export interface SubscriptionData {
  status : string;
  id: string;
  email : string;
  uid:string;
  date: string;
}

@Component({
  selector: 'app-dashboard-subscriptions-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class DashboardSubscriptionsOverviewComponent implements OnInit {


  admin$: Observable<any>;
  AdminSubscription: Subscription;
  DeleteSubscriptionsSubscription : Subscription;
  SettingsSubscription: Subscription;
  settings$: Observable<SettingsState>;
  resolution: any;

  subscriptions: any;
  subscriptionsFilter: any = 'all';
  displayedColumns: string[] = ['select','id', 'date'];
  
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

    this.admin$ = store.pipe(select('admin','subscriptions'));
    this.settings$ = store.pipe(select('settings'));
  }

  ngOnInit() {
      this.AdminSubscription = this._actions$.pipe(ofType(AdminActions.SuccessLoadSubscriptionsAction)).subscribe((result) => {
        this.subscriptions = result.payload;
        const subscriptions = Array.from(result.payload, subscription => this.createSubscription(subscription));
        this.dataSource = new MatTableDataSource(subscriptions);
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

      this.DeleteSubscriptionsSubscription = this._actions$.pipe(ofType(AdminActions.SuccessDeleteSubscriptionsAction)).subscribe((result) => {
        this.selection.clear();
        this.store.dispatch(AdminActions.BeginLoadSubscriptionsAction());
      });
  }

  createSubscription(subscription, filter?): SubscriptionData {
    if (!filter || filter == 'all' || subscription.status == filter) {
      return {
        id: subscription.subscriptionId,
        email : subscription.email,
        status : subscription.status,
        uid : subscription.uid,
        date : subscription.date
      };
    }
  }

  filterSubscriptions(type) {
    this.subscriptionsFilter = type;
    let subscriptions = Array.from(this.subscriptions, subscription => this.createSubscription(subscription, type));
    subscriptions = subscriptions.filter(function (element) {
      return element !== undefined;
    });
    this.dataSource = new MatTableDataSource(subscriptions);
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

  goToSubscription(subscriptionId,uid) {
    this.navSerivce.startLoading();
    this.router.navigateByUrl('store/subscriptions/' + subscriptionId + '/' + (uid ? uid : '') )
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
    const dialogRef = this.dialog.open(ConfirmDeleteSubscriptionModalComponent,config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.navSerivce.startLoading();
        this.store.dispatch(AdminActions.BeginDeleteSubscriptionsAction({payload : this.selection.selected}));
        console.log('The dialog was closed' , result);
      }
    });
  }

  ngOnDestroy(): void {
    this.AdminSubscription.unsubscribe();
    this.SettingsSubscription.unsubscribe();
    this.DeleteSubscriptionsSubscription.unsubscribe();
  }

}
