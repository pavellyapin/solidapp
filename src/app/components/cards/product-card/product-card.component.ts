import {Component, Injector, OnInit} from '@angular/core';
import { AbstractCardComponent } from 'src/app/components/cards/abstract-card-component';
import { Card } from 'src/app/components/cards/card';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import UserState from 'src/app/services/store/user/user.state';
import * as UserActions from 'src/app/services/store/user/user.action';
import { Observable, Subscription } from 'rxjs';
import { FavoriteItem } from 'src/app/services/store/user/user.model';
import { map } from 'rxjs/operators';
import { UtilitiesService } from 'src/app/services/util/util.service';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { Entry } from 'contentful';
import { FirestoreProductsService } from 'src/app/services/firestore/sub-services/firestore-products.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'doo-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent extends AbstractCardComponent implements OnInit {

  favorites$:Observable<FavoriteItem[]>;
  productReviews : any;
  UserSubscription: Subscription;
  FavoritesSubscription: Subscription;
  resolution$: Observable<string>;
  resolution : any;
  ResolutionSubscription : Subscription;
  isFavorite:FavoriteItem;
  cardStyle : any;
  productVariants: Map<string,[any]> = new Map();
  variantPrice : any;
  variantDiscount : any;
  environment = environment;

  constructor(public injector: Injector, 
              private navService: NavigationService,
              private router: Router,
              private firebase: FirestoreProductsService,
              private store: Store<{ user:UserState , settings: SettingsState }>,
              private utilService: UtilitiesService) {
    super(injector.get(Card.metadata.NAME),
      injector.get(Card.metadata.INDEX),
      injector.get(Card.metadata.OBJECT));
                
      this.cardStyle = this.injector.get(Card.metadata.STYLE);
      this.favorites$ = store.pipe(select('user','favorites'));
      this.resolution$ = store.pipe(select('settings' , 'resolution'));
  }

  ngOnInit() {
    if (this.cardStyle != 'simple') {
      this.UserSubscription = this.firebase.getProductReviews(this.object.sys.id)
      .pipe(
        map(reviewsSnap => {
          this.productReviews = Array<any>();
          reviewsSnap.forEach(element => {
            this.productReviews.push( element.payload.doc.data());
          });
        })
      )
      .subscribe();
  
      this.FavoritesSubscription = this.favorites$
      .pipe(
        map(favorites => {
          this.isFavorite = undefined;
          if (favorites) {
            favorites.forEach(element => {
              if (this.object.sys.id == element.product.productId) {
                this.isFavorite = element;
                return
              }
            });
          }
        })
      )
      .subscribe();
    }


    this.ResolutionSubscription = this.resolution$
    .pipe(
      map(x => {
        this.resolution = x;
      })
    )
    .subscribe();
    
    if (this.object.fields.variants) {
      this.sortVariants();
    }
  }

  getOverallRate() {
    let sum = 0 ;
    if (this.productReviews) {
      this.productReviews.forEach(review => {
        sum += review.rate;
      });
      return sum / this.productReviews.length;
    }
    return 0;
  }

  sortVariants() {
    this.object.fields.variants.forEach(variant => {
      if(this.productVariants.get(variant.fields.option)) {
        this.productVariants.get(variant.fields.option).push({name:variant.fields.name,code:variant.fields.code});
      } else {
        if (variant.fields.price) {
          this.variantPrice = variant.fields.price;
        }
        if (variant.fields.discount || variant.fields.discount  == 0) {
          this.variantDiscount = variant.fields.discount;
        }
        this.productVariants.set(variant.fields.option , 
                               [{name:variant.fields.name,code:variant.fields.code,checked:true}]);
      }
    });
  }

  goToProduct() {
    this.navService.resetStack([]);
    this.utilService.scrollTop();
    this.router.navigateByUrl('product/' + this.object.sys.id);
  }

  favoriteToggle(isFavorite) {
    if (!isFavorite) {
      this.store.dispatch(UserActions.BeginAddToFavoritesAction({payload : this.object.sys.id}));
    } else {
      this.store.dispatch(UserActions.BeginRemoveFromFavoritesAction({payload : this.isFavorite.docId}));
    }
  }

  ngOnDestroy(){
    if (this.cardStyle != 'simple') {
      this.UserSubscription.unsubscribe();
      this.FavoritesSubscription.unsubscribe();
    }
    this.ResolutionSubscription.unsubscribe();
  }

}
