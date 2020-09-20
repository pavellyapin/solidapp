import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import CartState from 'src/app/services/store/cart/cart.state';
import { Observable, Subscription } from 'rxjs';
import * as CartActions from '../../../services/store/cart/cart.action';
import { map } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { UtilitiesService } from 'src/app/services/util/util.service';
import UserState from 'src/app/services/store/user/user.state';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserAddressInfo, UserPerosnalInfo } from 'src/app/services/store/user/user.model';
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/services/navigation/navigation.service';


@Component({
  selector: 'doo-checkout-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss', '../cart.component.scss']
})
export class CheckoutPaymentComponent {

  //Subscription
  CartSubscription: Subscription;
  cartServiceSubscription: Subscription;
  UserSubscription: Subscription;
  //////////////


  cart$: Observable<CartState>;
  shippingAddress: any;
  shippingMethod: any;
  cartTotal: number;
  cartId: string;
  scriptLoaded: boolean = false;
  stripeURL: any = "https://js.stripe.com/v3/";
  stripeScriptText: any = "var stripe = Stripe('pk_test_qFVmFuri91DwZ8Y0DDAN5u0t00mNjGH4bc'); var elements = stripe.elements();";

  //@ViewChild('cardInfo') cardInfo: ElementRef;
  payType: any = "credit";
  card: any;
  cardNumber: any;
  cardExpiry: any;
  cardCvc: any;
  cardHandler = this.onChange.bind(this);
  error: any;

  paymentMethodForm: FormGroup;

  user$: Observable<UserState>;
  userInfo: UserPerosnalInfo;
  userAddressInfo: UserAddressInfo;


  constructor(private store: Store<{ cart: CartState, user: UserState }>,
    private router: Router,
    private dialog: MatDialog,
    private navService: NavigationService,
    private cd: ChangeDetectorRef,
    private utilService: UtilitiesService) {
    this.cart$ = store.pipe(select('cart'));
    this.user$ = store.pipe(select('user'));

    this.paymentMethodForm = new FormGroup({
      method: new FormControl('cc', Validators.required)
    })

  }

  ngOnInit() {

    this.CartSubscription = this.cart$
      .pipe(
        map(x => {
          this.cartTotal = x.total;
          this.cartId = x.cartId;
          this.shippingAddress = x.addressInfo;
          this.shippingMethod = x.shippingMethod;
        })
      )
      .subscribe();

    this.UserSubscription = this.user$
      .pipe(
        map(x => {
          this.userInfo = x.personalInfo;
          this.userAddressInfo = x.addressInfo;

        })
      )
      .subscribe();

    this.utilService.isScriptLoaded(this.stripeURL).then((loaded) => {
      if (!loaded) {
        this.utilService.loadScript(this.stripeURL).then(() => {
          this.utilService.loadScript(this.stripeURL, this.stripeScriptText).then(() => {
            this.initStripe();
            this.scriptLoaded = true;
          })
        });
      } else {
        this.initStripe();
        this.scriptLoaded = true;
      }
    });
  }

  backToAddress() {
    this.router.navigateByUrl('cart/checkout/' + this.cartId + '/shipping');
  }

  initStripe() {
    var inputs = document.querySelectorAll('.cell.example.example2 .input');
    Array.prototype.forEach.call(inputs, function (input) {
      input.addEventListener('focus', function () {
        input.classList.add('focused');
      });
      input.addEventListener('blur', function () {
        input.classList.remove('focused');
      });
      input.addEventListener('keyup', function () {
        if (input.value.length === 0) {
          input.classList.add('empty');
        } else {
          input.classList.remove('empty');
        }
      });
    });

    var elementStyles = {
      base: {
        iconColor: '#32325D',
        color: '#32325D',
        fontWeight: 500,
        fontSize: '16px',
        fontSmoothing: 'antialiased',

        '::placeholder': {
          color: '#CFD7DF',
        },
        ':-webkit-autofill': {
          color: '#e39f48',
        },
      },
      invalid: {
        color: '#E25950',

        '::placeholder': {
          color: '#FFCCA5',
        },
      },
    };

    var elementClasses = {
      focus: 'focused',
      empty: 'empty',
      invalid: 'invalid',
    };

    this.cardNumber = elements.create('cardNumber', {
      style: elementStyles,
      classes: elementClasses,
    });
    this.cardNumber.mount('#example2-card-number');

    this.cardExpiry = elements.create('cardExpiry', {
      style: elementStyles,
      classes: elementClasses,
    });
    this.cardExpiry.mount('#example2-card-expiry');

    this.cardCvc = elements.create('cardCvc', {
      style: elementStyles,
      classes: elementClasses,
    });
    this.cardCvc.mount('#example2-card-cvc');

  }

  payPalPay() {
    let config;
    config = {
      position: {
        top: '0px',
        right: '0px'
      },
      'max-width': '100vw',
      height: '100%',
      width: '100vw',
      panelClass: 'full-screen-modal',
      data: { total: this.cartTotal }
    };
    this.dialog.open(PayPalModalComponent,config);

  }



  async onSubmit() {
    this.navService.startLoading();
    this.cd.detectChanges();
    if (this.paymentMethodForm.controls['method'].value == 'cc') {
      const { source, error } = await stripe.createSource(this.cardNumber);
      if (error) {
        this.navService.finishLoading();
        this.error = error;
        console.log('Something is wrong:', error);
      } else {
        this.utilService.scrollTop();
        this.store.dispatch(CartActions.BeginSetStripeTokenAction({ payload: { cartId: this.cartId, source: source } }));
      }
    } else {
      this.payPalPay();
    }
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    //this.card.removeEventListener('change', this.cardHandler);
    this.cardNumber.destroy();
    this.cardExpiry.destroy();
    this.cardCvc.destroy();
  }
}

@Component({
  selector: 'doo-paypal-modal',
  templateUrl: '../paypal/paypal-modal.component.html',
  styleUrls: ['../paypal/paypal-modal.component.scss']
})
export class PayPalModalComponent {

  actionSubscription: Subscription;
  CartSubscription: Subscription;
  cartId$: Observable<string>;
  cardId: string;

  constructor(
    store: Store<{ cart: CartState }>,
    public dialogRef: MatDialogRef<PayPalModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CartData,
    private firebaseFunctions: FirestoreService) {
    this.cartId$ = store.pipe(select('cart', 'cartId'));
  }

  ngOnInit() {

    this.CartSubscription = this.cartId$
      .pipe(
        map(x => {
          this.cardId = x;
        })
      )
      .subscribe();

    this.actionSubscription = this.firebaseFunctions.payPalPay(this.data, this.cardId).pipe(
      map((data) => {
        console.log('pasha' , data)
        if (data.code == 200) {
          window.open(data.redirect,"_self");
        }
      }
      )
    ).subscribe();


  }

  ngOnDestroy() {
    this.CartSubscription.unsubscribe();
    this.actionSubscription.unsubscribe();
  }

  onNoClick(): void {
    this.CartSubscription.unsubscribe();
    this.actionSubscription.unsubscribe();
    this.dialogRef.close();
  }

}

export interface CartData {
  cart: any;
  total: number;
}