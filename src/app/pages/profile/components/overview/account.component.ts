import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import UserState from 'src/app/services/store/user/user.state';
import * as UserActions from 'src/app/services/store/user/user.action';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { UserPerosnalInfo } from 'src/app/services/store/user/user.model';
import { Actions, ofType } from '@ngrx/effects';
import { NavigationService } from 'src/app/services/navigation/navigation.service';

@Component({
  selector: 'account-overview',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountOverviewComponent implements OnInit , OnDestroy {

  user$: Observable<UserPerosnalInfo>;
  UserSubscription: Subscription;
  actionSubscription: Subscription;
  userInfo : any;
  
  constructor( store: Store<{ user: UserState }>,
              private navService: NavigationService,) {
                this.user$ = store.pipe(select('user','personalInfo'));
  }

  ngOnInit() {
    this.UserSubscription = this.user$
      .pipe(
        map(x => {
          this.userInfo = x;
          this.navService.finishLoading();
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.UserSubscription.unsubscribe();
    //this.actionSubscription.unsubscribe();
  }
}
