import {Component , OnInit, ViewChild} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import UserState from 'src/app/services/store/user/user.state';
import { map } from 'rxjs/operators';
import { OrderItem } from 'src/app/services/store/user/user.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'doo-user-orers',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  orders$: Observable<Array<OrderItem>>;
  UserSubscription: Subscription;
  orderItems: Array<OrderItem>;
  dataSource : any;
  displayedColumns: string[] = ['id', 'date', 'status', 'total'];

      constructor(store: Store<{ user: UserState }>)
        {
          this.orders$ = store.pipe(select('user','orders'));
        }
        
        
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    this.UserSubscription = this.orders$
    .pipe(
      map(x => {
        this.orderItems = x;
        this.dataSource = new MatTableDataSource<any>(this.orderItems);
      })
    )
    .subscribe();

    this.dataSource.paginator = this.paginator;
  }


  ngOnDestroy(){
    this.UserSubscription.unsubscribe();
  }

}
