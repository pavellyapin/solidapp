import {Component , OnInit} from '@angular/core';
import { Store, select } from '@ngrx/store';
import UserState from 'src/app/services/store/user/user.state';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { OrderItem } from 'src/app/services/store/user/user.model';

@Component({
    selector: 'doo-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.scss']
  })
  export class OrderDeatilComponent implements OnInit {

    orders$: Observable<Array<OrderItem>>;
    UserSubscription: Subscription;
    orderdetail: any;
  
  
    constructor(store: Store<{ user: UserState }>,public route:ActivatedRoute)
    {
      this.orders$ = store.pipe(select('user','orders'));
    }

    ngOnInit() {
        this.UserSubscription = this.orders$
        .pipe(
          map(x => {
            this.orderdetail = x.filter((order) => {
                if (order.id == this.route.snapshot.params["orderId"]) {
                    return order;
                }
            }).pop();
          })
        )
        .subscribe();
    }

    ngOndestory() {
        this.UserSubscription.unsubscribe();
    }
  }