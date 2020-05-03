import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import CartState from 'src/app/services/store/cart/cart.state';
import { Observable, Subscription } from 'rxjs';
import * as CartActions from '../../../services/store/cart/cart.action';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import UserState from 'src/app/services/store/user/user.state';
import { UserPerosnalInfo } from 'src/app/services/store/user/user.model';
import { MyErrorStateMatcher } from 'src/app/components/pipes/pipes';
import { CartService } from '../cart.service';

@Component({
    selector: 'doo-checkout-shipping',
    templateUrl: './shipping.component.html',
    styleUrls: ['./shipping.component.scss','../cart.component.scss']
  })
  export class CheckoutShippingComponent  {

    cartId$: Observable<any>;
    user$: Observable<UserPerosnalInfo>;
    cartId : string;
    CartSubscription: Subscription;
    UserSubscription: Subscription;
    cartServiceSubscription: Subscription;
    addressInfo: FormGroup;
    personalInfo: FormGroup;
    userInfo: UserPerosnalInfo;
    matcher = new MyErrorStateMatcher();
  

    constructor(private store: Store<{ cart: CartState , user: UserState }> , private cartService : CartService) {
        this.cartId$ = store.pipe(select('cart','cartId'));
        this.user$ = store.pipe(select('user','personalInfo'));

        this.personalInfo = new FormGroup({        
            firstName: new FormControl('' ,Validators.required),
            lastName: new FormControl('',Validators.required),
            phone: new FormControl(''),
            email: new FormControl('',Validators.required)
        })
    }

    ngOnInit() {
        this.CartSubscription = this.cartId$
        .pipe(
          map(x => {
            this.cartId = x;
          })
        )
        .subscribe();

        this.UserSubscription = this.user$
        .pipe(
          map(x => {
            this.userInfo = x;
            this.personalInfo.controls["firstName"].setValue(this.userInfo.firstName);
            this.personalInfo.controls["lastName"].setValue(this.userInfo.lastName);
  
            this.personalInfo.controls["phone"].setValue(this.userInfo.phone);
            this.personalInfo.controls["email"].setValue(this.userInfo.email);
          })
        )
        .subscribe();

        this.cartServiceSubscription =  this.cartService.changeEmitted$.subscribe((x)=>{
            if (this.personalInfo.invalid) {
                this.personalInfo.markAllAsTouched();
            }
            if (this.addressInfo.invalid) {
                this.addressInfo.markAllAsTouched();
            }
            if (this.addressInfo.valid && this.personalInfo.valid) {
                this.store.dispatch(CartActions.
                    BeginSetOrderShippingAction({payload :{address : this.addressInfo.value , 
                                                 personalInfo : this.personalInfo.value , 
                                                 cartId : this.cartId}}));
            }
        })
    }

    addressUpdate(form : FormGroup) {
        this.addressInfo = form;
    }

    ngOnDestroy(){
        this.cartServiceSubscription.unsubscribe();
        this.CartSubscription.unsubscribe();
        this.UserSubscription.unsubscribe();
        
      }
  }