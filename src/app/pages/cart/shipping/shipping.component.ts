import { Component, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import CartState from 'src/app/services/store/cart/cart.state';
import { Observable, Subscription } from 'rxjs';
import * as CartActions from '../../../services/store/cart/cart.action';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import UserState from 'src/app/services/store/user/user.state';
import { UserPerosnalInfo, UserAddressInfo } from 'src/app/services/store/user/user.model';
import { MyErrorStateMatcher } from 'src/app/components/pipes/pipes';
import { CartService } from '../cart.service';
import { AddressFormComponent } from 'src/app/components/address/address-form/address.component';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { Entry } from 'contentful';

@Component({
    selector: 'doo-checkout-shipping',
    templateUrl: './shipping.component.html',
    styleUrls: ['./shipping.component.scss','../cart.component.scss']
  })
  export class CheckoutShippingComponent  {

    cartTotal$: Observable<Number>;
    user$: Observable<UserState>;
    cartId : string;
    CartSubscription: Subscription;
    UserSubscription: Subscription;
    cartServiceSubscription: Subscription;
    cartTotalSubscription: Subscription;
    addressInfo: FormGroup;
    shippingInfo: FormGroup;
    userInfo: UserPerosnalInfo;
    userAddressInfo: UserAddressInfo;
    matcher = new MyErrorStateMatcher();
    settings$: Observable<Entry<any>>;
    SettingsSubscription: Subscription;
    siteSettings: Entry<any>;
    shippingOptions : any;
    cartTotal : any;
    
    @ViewChild('addressForm',{static: false}) 
    public addressFormComponent: AddressFormComponent;
         

    constructor(private store: Store<{ cart: CartState , user: UserState , settings : SettingsState }> , 
                private cartService : CartService) {
        this.cartTotal$ = store.pipe(select('cart' , 'total'));
        this.user$ = store.pipe(select('user'));
        this.settings$ = store.pipe(select('settings','siteConfig'));


        this.shippingInfo = new FormGroup({        
            firstName: new FormControl('' ,Validators.required),
            lastName: new FormControl('',Validators.required),
            phone: new FormControl(''),
            email: new FormControl('',Validators.required),
            shipping: new FormControl('')
        });
    }

    ngOnInit() {
        this.CartSubscription = this.cartTotal$
        .pipe(
          map(x => {
            this.cartTotal = x;
            this.setShippingOptions();
          })
        )
        .subscribe();

        this.UserSubscription = this.user$
        .pipe(
          map(x => {
            this.userInfo = x.personalInfo;
            this.userAddressInfo = x.addressInfo;
            this.shippingInfo.controls["firstName"].setValue(this.userInfo.firstName);
            this.shippingInfo.controls["lastName"].setValue(this.userInfo.lastName);
  
            this.shippingInfo.controls["phone"].setValue(this.userInfo.phone);
            this.shippingInfo.controls["email"].setValue(this.userInfo.email);
          })
        )
        .subscribe();

        this.SettingsSubscription = this.settings$
        .pipe(
          map(x => {
            //console.log(x);
            this.siteSettings = x;
            this.setShippingOptions();
          })
        )
        .subscribe();

        this.cartServiceSubscription =  this.cartService.shippingChangeEmitted$.subscribe((x)=>{
            if (this.shippingInfo.invalid) {
                this.shippingInfo.markAllAsTouched();
            }
            if (this.addressInfo.invalid) {
                this.addressInfo.markAllAsTouched();
            }
            if (this.addressInfo.valid && this.shippingInfo.valid) {
               /* this.store.dispatch(CartActions.
                    BeginSetOrderShippingAction({payload :{address : this.addressInfo.value , 
                                                 personalInfo : this.shippingInfo.value , 
                                                 cartId : this.cartId}}));*/
            }
        })
    }

    setShippingOptions() {
      if (this.siteSettings) {
        this.shippingOptions = this.siteSettings.fields.shipping.filter((option)=> {
          if (option.fields.minTotal <= this.cartTotal && (!option.fields.maxTotal || option.fields.maxTotal > this.cartTotal)) {
            return option;
          }
        });
        this.setShippingMethod(this.shippingOptions[0]);
        this.shippingInfo.controls["shipping"].setValue(this.shippingOptions[0]);
      }
    }

    setShippingMethod(shippingMethod) {
      this.store.dispatch(CartActions.
        BeginSetShippingMethodAction({payload : shippingMethod}));
    }

    addressUpdate(form : FormGroup) {
        this.addressInfo = form;
    }

    ngOnDestroy(){
        this.cartServiceSubscription.unsubscribe();
        this.CartSubscription.unsubscribe();
        this.UserSubscription.unsubscribe();
        this.SettingsSubscription.unsubscribe();
        
      }
  }