import { Component, ViewChild, Inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import CartState from 'src/app/services/store/cart/cart.state';
import { Observable, Subscription } from 'rxjs';
import * as CartActions from '../../../services/store/cart/cart.action';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import UserState from 'src/app/services/store/user/user.state';
import { UserPerosnalInfo, UserAddressInfo } from 'src/app/services/store/user/user.model';
import { MyErrorStateMatcher } from 'src/app/components/pipes/pipes';
import { AddressFormComponent } from 'src/app/components/address/address-form/address.component';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { Entry } from 'contentful';
import * as UserActions from 'src/app/services/store/user/user.action';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilitiesService } from 'src/app/services/util/util.service';

@Component({
  selector: 'doo-checkout-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss', '../cart.component.scss']
})
export class CheckoutShippingComponent {

  //Subscription
  CartSubscription: Subscription;
  UserSubscription: Subscription;
  cartTotalSubscription: Subscription;
  SettingsSubscription: Subscription;
  ShippingMethodSubscription: Subscription;
  /////////////

  cartTotal$: Observable<Number>;
  cartId: string;
  cartTotal: any;

  user$: Observable<UserState>;
  shippingMethod$: Observable<any>;
  shippingMethodDetails: any;
  userInfo: UserPerosnalInfo;
  userAddressInfo: UserAddressInfo;
  shippingMethodForm: FormGroup;
  shippingOptions: any;
  matcher = new MyErrorStateMatcher();

  settings$: Observable<SettingsState>;
  siteSettings: Entry<any>;
  resolution: any;


  @ViewChild('addressForm', { static: false })
  public addressFormComponent: AddressFormComponent;


  constructor(private store: Store<{ cart: CartState, user: UserState, settings: SettingsState }>,
    private navService: NavigationService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private utilService: UtilitiesService) {
    this.cartTotal$ = store.pipe(select('cart', 'total'));
    this.user$ = store.pipe(select('user'));
    this.settings$ = store.pipe(select('settings'));
    this.shippingMethod$ = store.pipe(select('cart', 'shippingMethod'));

    this.shippingMethodForm = new FormGroup({
      shipping: new FormControl('', Validators.required)
    })
  }

  ngOnInit() {
    this.CartSubscription = this.cartTotal$
      .pipe(
        map(x => {
          this.cartTotal = x;
        })
      )
      .subscribe();

    this.UserSubscription = this.user$
      .pipe(
        map(x => {
          this.userInfo = x.personalInfo;
          if (x.addressInfo) {
            this.userAddressInfo = x.addressInfo;
          }
        })
      )
      .subscribe();

    this.ShippingMethodSubscription = this.shippingMethod$
      .pipe(
        map(x => {
          this.shippingMethodDetails = x;
        })
      )
      .subscribe();

    this.SettingsSubscription = this.settings$
      .pipe(
        map(x => {
          //console.log(x);
          this.siteSettings = x.siteConfig;
          this.resolution = x.resolution;
          this.setShippingOptions();
        })
      )
      .subscribe();
  }

  setShippingOptions() {
    if (this.siteSettings) {
      this.shippingOptions = this.siteSettings.fields.shipping.filter((option) => {
        if (option.fields.minTotal <= this.cartTotal && (!option.fields.maxTotal || option.fields.maxTotal > this.cartTotal)) {
          return option;
        }
      });
      if (this.shippingMethodDetails) {
        this.setShippingMethod(this.shippingMethodDetails.name);
        this.shippingMethodForm.controls["shipping"].setValue(this.shippingMethodDetails.name);
      } else {
        this.setShippingMethod(this.shippingOptions[0].fields.name);
        this.shippingMethodForm.controls["shipping"].setValue(this.shippingOptions[0].fields.name);
      }

    }
  }

  setShippingMethod(shippingMethod) {
    const chosenMethod = this.siteSettings.fields.shipping.filter((option) => {
      if (option.fields.name == shippingMethod) {
        return option;
      }
    }).pop();
    this.store.dispatch(CartActions.
      BeginSetShippingMethodAction({ payload: chosenMethod.fields }));
  }

  openAddressModal() {
    let config;
    if (this.utilService.bigScreens.includes(this.resolution)) {
      config = {
        height: '80%',
        width: '60vw',
        data: { userAddressInfo: this.userAddressInfo, userInfo: this.userInfo }
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
        data: { userAddressInfo: this.userAddressInfo, userInfo: this.userInfo }
      };
    }

    this.dialog.open(CartShippingModalComponent, config);
  }

  continueCheckout() {
    if (this.userAddressInfo) {
      this.utilService.scrollTop();
      this.navService.startLoading();
      this.store.dispatch(CartActions.
        BeginSetOrderShippingAction({
          payload: {
            address: this.userAddressInfo,
            personalInfo: this.userInfo,
            shipping: this.shippingMethodDetails,
            cartId: this.route.snapshot.params["cartId"]
          }
        }));
    } else {
      this.openAddressModal();
    }
  }

  ngOnDestroy() {
    this.CartSubscription.unsubscribe();
    this.UserSubscription.unsubscribe();
    this.SettingsSubscription.unsubscribe();

  }
}

@Component({
  selector: 'doo-cart-shipping-address-modal',
  templateUrl: './address-modal/address-modal.component.html'
})
export class CartShippingModalComponent {


  constructor(
    private store: Store<{}>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CartShippingModalComponent>) {
  }

  addressUpdate($event) {
    this.store.dispatch(UserActions.SuccessGetUserAddressInfoAction({ payload: $event }));
    this.dialogRef.close();
  }

  personalInfoUpdate($event) {
    this.store.dispatch(UserActions.SuccessSetCartUserAction({ payload: $event }));
  }

}