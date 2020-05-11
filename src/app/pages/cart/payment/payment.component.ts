import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import CartState from 'src/app/services/store/cart/cart.state';
import { Observable, Subscription } from 'rxjs';
import * as CartActions from '../../../services/store/cart/cart.action';
import { map } from 'rxjs/operators';
import { VariantsPipe } from 'src/app/components/pipes/pipes';
import { CartService } from '../cart.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { CartCardsService } from '../cart-cards/product-cards.service';
import { UtilitiesService } from 'src/app/services/util/util.service';


@Component({
    selector: 'doo-checkout-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss','../cart.component.scss']
  })
  export class CheckoutPaymentComponent  {

    cart$: Observable<CartState>;
    cartTotal : string;
    cartId : string;
    CartSubscription: Subscription;
    cartServiceSubscription: Subscription;
    scriptLoaded: boolean  = false;
    stripeURL : any = "https://js.stripe.com/v3/";
    stripeScriptText : any = "var stripe = Stripe('pk_test_qFVmFuri91DwZ8Y0DDAN5u0t00mNjGH4bc'); var elements = stripe.elements();";

    //@ViewChild('cardInfo') cardInfo: ElementRef;
    payType : any = "credit";
    card :any;
    cardNumber :any;
    cardExpiry :any;
    cardCvc :any;
    cardHandler = this.onChange.bind(this);
    error: string;

    constructor(private store: Store<{ cart: CartState }> ,
                private variantPipe : VariantsPipe,
                private cartService : CartService,
                private cartItemsService: CartCardsService,
                private dialog: MatDialog,
                private cd: ChangeDetectorRef,
                private utilService: UtilitiesService) {
        this.cart$ = store.pipe(select('cart'));
    }

    ngOnInit() {

        this.CartSubscription = this.cart$
        .pipe(
          map(x => {
            this.cartTotal = x.total;
            this.cartId = x.cartId;
          })
        )
        .subscribe();

        this.utilService.isScriptLoaded(this.stripeURL).then((loaded)=>{
            if (!loaded) {
                this.utilService.loadScript(this.stripeURL).then(()=>{
                    this.utilService.loadScript(this.stripeURL , this.stripeScriptText).then(()=>{
                        this.initStripe();
                        this.scriptLoaded = true;
                    })
                });
            } else {
                this.initStripe();
                this.scriptLoaded = true;
            }
        });

        this.cartServiceSubscription =  this.cartService.paymentChangeEmitted$.subscribe((x)=>{
            this.onSubmit();
        })
    }

    initStripe() {
        var inputs = document.querySelectorAll('.cell.example.example2 .input');
        Array.prototype.forEach.call(inputs, function(input) {
        input.addEventListener('focus', function() {
            input.classList.add('focused');
        });
        input.addEventListener('blur', function() {
            input.classList.remove('focused');
        });
        input.addEventListener('keyup', function() {
            if (input.value.length === 0) {
            input.classList.add('empty');
            } else {
            input.classList.remove('empty');
            }
        });
        });

        var elementStyles = {
            base: {
            iconColor : '#32325D',
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
        let reqCart = [];
            
        this.cartItemsService.cards.value.forEach(function(item){
            reqCart.push(
                {product_id : item.input.object.value.sys.id,
                thumbnail : item.input.object.value.fields.media[0].fields.file.url,
                name : item.input.name.value +  
                (item.input.object.value.fields.variants ? 
                this.variantPipe.transform(item.input.object.value.fields.variants) : ''),
                qty : item.input.object.value.fields.qty,
                price : item.input.object.value.fields.discount ? 
                        item.input.object.value.fields.discount : 
                        item.input.object.value.fields.price }
            )
            }.bind(this));

            this.dialog.open(PayPalModalComponent, {
            width: '750px',
            data: {cart: reqCart, total: parseFloat(this.cartTotal).toFixed(2)}
            });
        
        }

    async onSubmit() {
        
        const { source, error } = await stripe.createSource(this.cardNumber);
    
        if (error) {
          console.log('Something is wrong:', error);
        } else {
          this.store.dispatch(CartActions.BeginSetStripeTokenAction({payload :{cartId : this.cartId, source : source}}));
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
      private firebaseFunctions : FirestoreService) {
        this.cartId$ = store.pipe(select('cart','cartId'));
      }
  
    ngOnInit() {
  
      this.CartSubscription = this.cartId$
      .pipe(
        map(x => {
          this.cardId = x;
        })
      )
      .subscribe();
  
        this.actionSubscription = this.firebaseFunctions.payPalPay(this.data,this.cardId).pipe(
              map((data)=> {
                if (data.code == 200) {
                  window.open(data.redirect, 'theFrame', 'location=yes,scrollbars=yes,status=yes');
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