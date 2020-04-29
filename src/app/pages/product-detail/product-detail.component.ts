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
import { MyErrorStateMatcher } from 'src/app/components/pipes/pipes';
import UserState from 'src/app/services/store/user/user.state';
import { FavoriteItem } from 'src/app/services/store/user/user.model';

@Component({
  selector: 'doo-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDeatilComponent implements OnInit {

  product$: Observable<Entry<any>>;
  favorites$:Observable<FavoriteItem[]>;
  ProductSubscription: Subscription;
  UserSubscription: Subscription;
  productDetails:Entry<any>;
  isFavorite:FavoriteItem;
  cartItemForm:FormGroup;
  matcher = new MyErrorStateMatcher();
  formSubmit = false;
  productVariants: Map<string,[any]> = new Map();
  displayedMediaIndex:number = 0;

      constructor(private store: Store<{ products: ProductsState , user:UserState }>)
        {
          this.product$ = store.pipe(select('products' , 'productDetails'));
          this.favorites$ = store.pipe(select('user','favorites'));
        }

  ngOnInit() {

    this.cartItemForm = new FormGroup({        
      size:  new FormControl(''),
      color: new FormControl(''),
      qty: new FormControl(1 , Validators.required)
    })

    this.ProductSubscription = this.product$
    .pipe(
      map(x => {
        this.productDetails = x;
        if (this.productDetails && this.productDetails.fields.variants) {
          this.sortVariants();
        }
      })
    )
    .subscribe();

    this.UserSubscription = this.favorites$
    .pipe(
      map(favorites => {
        this.isFavorite = undefined;
        favorites.forEach(element => {
          if (this.productDetails.sys.id == element.product.productId) {
            this.isFavorite = element;
            return
          }
        });
      })
    )
    .subscribe();
  }

  addProductToCart() {
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
    } else {
      this.formSubmit = true;
    }
  }

  sortVariants() {
    this.productDetails.fields.variants.forEach(variant => {
      this.cartItemForm.controls[variant.fields.option].setValidators(Validators.required)
      if(this.productVariants.get(variant.fields.option)) {
        this.productVariants.get(variant.fields.option).push({name:variant.fields.name,code:variant.fields.code});
      } else {
        this.productVariants.set(variant.fields.option , 
                               [{name:variant.fields.name,code:variant.fields.code,checked:true}]);
        this.cartItemForm.controls[variant.fields.option].setValue(variant.fields.code);
      }
    });
  }

  addToFavorites() {
    this.store.dispatch(UserActions.BeginAddToFavoritesAction({payload : this.productDetails.sys.id}));
  }

  removeFromFavorites() {
    this.store.dispatch(UserActions.BeginRemoveFromFavoritesAction({payload : this.isFavorite.docId}));
  }

  changeImage(index) {
    this.displayedMediaIndex = index;
  }

  ngOnDestroy(){
    this.ProductSubscription.unsubscribe();
    this.UserSubscription.unsubscribe();
  }

}
