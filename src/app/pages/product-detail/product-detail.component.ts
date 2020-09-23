import {Component , OnInit} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import ProductsState from 'src/app/services/store/product/product.state';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Entry } from 'contentful';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CartItem } from 'src/app/services/store/cart/cart.model';
import * as CartActions from '../../services/store/cart/cart.action';
import * as UserActions from '../../services/store/user/user.action';
import UserState from 'src/app/services/store/user/user.state';
import { FavoriteItem } from 'src/app/services/store/user/user.model';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { UtilitiesService } from 'src/app/services/util/util.service';
import CartState from 'src/app/services/store/cart/cart.state';
import { SEOService } from 'src/app/services/seo/seo.service';

@Component({
  selector: 'doo-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDeatilComponent implements OnInit {

  //Subscription
  ProductSubscription: Subscription;
  ProductReviewsSubscription: Subscription;
  PagesSubscription: Subscription;
  UserSubscription: Subscription;
  SettingsSubscription : Subscription;
  CartIdSubscription: Subscription;
  ///////////////

  cart$: Observable<CartState>;
  cartId : string;
  cartItems: Array<any>;

  user$:Observable<UserState>;
  userId:any;
  
  layout : string = 'standard';
  product$: Observable<Entry<any>>;
  
  pages$: Observable<Entry<any>[]>;
  productReviews$: Observable<any[]>;
  resolution$: Observable<string>;
  productDetails:Entry<any>;
  productReviews: any[];
  pageLayout : Entry<any>;
  isFavorite:FavoriteItem;
  cartItemForm:FormGroup;
  formSubmit = false;
  productVariants: Map<string,[any]> = new Map();
  displayedMediaIndex:number = 0;
  resolution : any;
  

      constructor(private navService: NavigationService,
                  private utilService : UtilitiesService,
                  private seoService : SEOService,
                  private store: Store<{ products: ProductsState , 
                                         user:UserState , 
                                         cart:CartState ,
                                         settings: SettingsState }>)
        {
          this.cartItemForm = new FormGroup({        
            size:  new FormControl(''),
            color: new FormControl(''),
            qty: new FormControl(1 , Validators.required)
          });

          this.product$ = store.pipe(select('products' , 'productDetails'));
          this.productReviews$ = store.pipe(select('products' , 'reviews'));
          
          this.user$ = store.pipe(select('user'));
          this.pages$ = store.pipe(select('settings' , 'pages'));

          this.cart$ = store.pipe(select('cart'));

          this.resolution$ = store.pipe(select('settings' , 'resolution'));
        }

  ngOnInit() {
    



    this.CartIdSubscription = this.cart$
    .pipe(
      map(x => {
        this.cartId = x.cartId;
        this.cartItems = x.items;
      })
    )
    .subscribe();

    this.ProductSubscription = this.product$
    .pipe(
      map(x => {
        this.productDetails = x;
        this.seoService.updateTitle(this.productDetails.fields.title);
        this.seoService.updateDescription(this.productDetails.fields.title);
        this.seoService.updateOgUrl(window.location.href);
        if (this.productDetails && this.productDetails.fields.variants) {
          this.sortVariants();
        }
        this.navService.finishLoading();
      })
    )
    .subscribe();

    this.ProductReviewsSubscription = this.productReviews$
    .pipe(
      map(x => {
        this.productReviews = x;
      })
    )
    .subscribe();

    this.PagesSubscription = this.pages$
    .pipe(
      map(x => {
        if (x) {
          this.pageLayout = x.filter(page=> {
            if(page.fields.type == "product") {
              return page;
            }
          }).pop();
        }
      })
    )
    .subscribe();

    this.UserSubscription = this.user$
    .pipe(
      map(x => {
        this.isFavorite = undefined;
        if (x.favorites) {
          x.favorites.forEach(element => {
            if (this.productDetails.sys.id == element.product.productId) {
              this.isFavorite = element;
              return
            }
          });
        }
        this.userId = x.uid;

      })
    )
    .subscribe();

    this.SettingsSubscription = this.resolution$
    .pipe(
      map(x => {
        this.resolution = x;
      })
    )
    .subscribe();
  }

  ngAfterViewInit() {
    this.navService.finishLoading();
  }

  

  addProductToCart() {
    this.utilService.scrollTop();
    if(this.cartItemForm.valid) {
        let item = new CartItem();
        item.variants = {}
        item.productId = this.productDetails.sys.id;
        item.qty = Number(this.cartItemForm.controls["qty"].value);

        if (this.cartItemForm.controls["size"].value != '') {
          item.variants.size =  this.cartItemForm.controls["size"].value;
        }
        if (this.cartItemForm.controls["color"].value != '') {
          item.variants.color = this.cartItemForm.controls["color"].value;
        }

        if (this.cartItemForm.controls["color"].value != '') {
          item.variants.color = this.cartItemForm.controls["color"].value;
        }
        this.store.dispatch(CartActions.BeginAddProductToCartAction({payload : item}));
        this.initializeOrder();
    } else {
      this.formSubmit = true;
    }
  }

  initializeOrder() {
    let reqCart = [];
    this.cartItems.forEach(function(item){
          reqCart.push(
            {product_id : item.productId,
            qty : item.qty }
          )
        }.bind(this));
         this.store.dispatch(CartActions.
          BeginBackGroundInitializeOrderAction({payload :{cartId : this.cartId, 
                                                    cart : {cart : reqCart}
                                                  }}));
    
  }

  sortVariants() {
    this.productDetails.fields.variants.forEach(variant => {
      this.cartItemForm.controls[variant.fields.option].setValidators(Validators.required)
      if(this.productVariants.get(variant.fields.option)) {
        this.productVariants.get(variant.fields.option).push({name:variant.fields.name,code:variant.fields.name});
      } else {
        this.productVariants.set(variant.fields.option , 
                               [{name:variant.fields.name,code:variant.fields.code,checked:true}]);
        this.cartItemForm.controls[variant.fields.option].setValue(variant.fields.name);
      }
    });
  }



  favoriteToggle($event) {
    if (!$event) {
      this.store.dispatch(UserActions.BeginAddToFavoritesAction({payload : this.productDetails.sys.id}));
    } else {
      this.store.dispatch(UserActions.BeginRemoveFromFavoritesAction({payload : this.isFavorite.docId}));
    }
  }

  changeImage(index) {
    this.displayedMediaIndex = index;
  }

  addQty() {
    this.cartItemForm.controls["qty"].setValue(this.cartItemForm.controls["qty"].value + 1);
  }

  removeQty() {
    if (this.cartItemForm.controls["qty"].value > 1) {
      this.cartItemForm.controls["qty"].setValue(this.cartItemForm.controls["qty"].value - 1);
    }
  }

  ngOnDestroy(){
    this.ProductSubscription.unsubscribe();
    this.ProductReviewsSubscription.unsubscribe();
    this.UserSubscription.unsubscribe();
    this.PagesSubscription.unsubscribe();
    this.SettingsSubscription.unsubscribe();
  }

}
