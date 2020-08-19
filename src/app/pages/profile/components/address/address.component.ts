import {Component , OnInit} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import UserState from 'src/app/services/store/user/user.state';
import { UserAddressInfo } from 'src/app/services/store/user/user.model';
import * as UserActions from 'src/app/services/store/user/user.action';

@Component({
  selector: 'doo-user-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class ProfileAddressComponent implements OnInit {

  address$: Observable<UserAddressInfo>;
  AddressSubscription: Subscription;
  userAddressInfo : any;

  editAddress: boolean = false;
  
      constructor(private store: Store<{ user: UserState }>,
                  private navService: NavigationService)
        {
          this.address$ = store.pipe(select('user','addressInfo'));
        }

  ngOnInit() {
    
    this.AddressSubscription = this.address$
    .pipe(
      map(x => {
       if (x) {
          this.userAddressInfo = x;
          this.navService.finishLoading();
        }
      })
    )
    .subscribe();

        
  }

  addressUpdate($event) {
    this.navService.startLoading();
    this.store.dispatch(UserActions.BeginUpdateUserAddressInfoAction({ payload: $event }));
  }

  ngOnDestroy(){
    this.AddressSubscription.unsubscribe();
  }

}
