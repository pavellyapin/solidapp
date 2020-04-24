import {Component , OnInit} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { map, startWith } from 'rxjs/operators';
import { FavoritesCardsService } from './product-cards/favorites-cards.service';
import { MediaObserver } from '@angular/flex-layout';
import { Card } from 'src/app/components/cards/card';
import { FavoritesCardComponent } from './product-cards/product-card/product-card.component';
import { CartItem } from 'src/app/services/store/cart/cart.model';
import { ContentfulService } from 'src/app/services/contentful/contentful.service';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { Router } from '@angular/router';
import UserState from 'src/app/services/store/user/user.state';
import { FavoriteItem } from 'src/app/services/store/user/user.model';

@Component({
  selector: 'doo-user-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  favorites$: Observable<FavoriteItem[]>;
  UserSubscription: Subscription;
  favoritesItems: Array<any>;
  favItemsCards: Card[] = [];
  favItemCount: number;
  cols: Observable<number>;
  colsBig: Observable<number>;
  rowsBig: Observable<number>;
  previousUrl : string = '';

      constructor(store: Store<{ user: UserState }>,
                  private mediaObserver: MediaObserver,
                  private favoritesCardsService: FavoritesCardsService,
                  private contentfulService: ContentfulService,
                  private navService: NavigationService,
                  private router: Router)
        {
          this.favoritesCardsService.cards.subscribe(cards => {
            this.favItemsCards = cards;
          });
          this.favorites$ = store.pipe(select('user','favorites'));
        }

  ngOnInit() {
    this.navService.getPreviousUrl().forEach((segment) => {
      this.previousUrl = this.previousUrl + '/' + segment 
    });
    
    this.UserSubscription = this.favorites$
    .pipe(
      map(x => {
        this.favoritesItems = x;
        this.favItemCount = this.favoritesItems.length;
        this.favoritesCardsService.resetCards();
        this.createCards();
      })
    )
    .subscribe();

          /* Grid column map */
          const colsMap = new Map([
            ['xs', 1],
            ['sm', 4],
            ['md', 8],
            ['lg', 9],
            ['xl', 8],
          ]);
          /* Big card column span map */
          const colsMapBig = new Map([
            ['xs', 1],
            ['sm', 4],
            ['md', 8],
            ['lg', 3],
            ['xl', 2],
          ]);
          /* Small card column span map */
          const rowsMapBig = new Map([
            ['xs', 2],
            ['sm', 2],
            ['md', 2],
            ['lg', 5],
            ['xl', 2],
          ]);
          let startCols: number;
          let startColsBig: number;
          let startRowsBig: number;
          colsMap.forEach((cols, mqAlias) => {
            if (this.mediaObserver.isActive(mqAlias)) {
              startCols = cols;
            }
          });
          colsMapBig.forEach((cols, mqAlias) => {
            if (this.mediaObserver.isActive(mqAlias)) {
              startColsBig = cols;
            }
          });
          rowsMapBig.forEach((rows, mqAliast) => {
            if (this.mediaObserver.isActive(mqAliast)) {
              startRowsBig = rows;
            }
          });
          const media$ = this.mediaObserver.asObservable();
          this.cols = media$.pipe(
            map(change => {
              return colsMap.get(change[0].mqAlias);
            }),
            startWith(startCols),
          );
          this.colsBig = media$.pipe(
            map(change => {
              return colsMapBig.get(change[0].mqAlias);
            }),
            startWith(startColsBig),
          );
          this.rowsBig = media$.pipe(
            map(change => {
              return rowsMapBig.get(change[0].mqAlias);
            }),
            startWith(startRowsBig),
          );
  }

  createCards(): void {
    this.favoritesItems.forEach((v,index) => {
        this.contentfulService.getProductDetails(v.product.productId).forEach(
          x => {
            this.favoritesCardsService.addCard(
              new Card(
                {
                  name: {
                    key: Card.metadata.NAME,
                    value:  x.fields.title,
                  },
                  index: {
                    key: Card.metadata.INDEX,
                    value:  v.docId,
                  },
                  object: {
                    key: Card.metadata.OBJECT,
                    value:  x,
                  },
                  routerLink: {
                    key: Card.metadata.ROUTERLINK,
                    value: '/product/' + v.product.productId,
                  },
                  cols: {
                    key: Card.metadata.COLS,
                    value: this['colsBig'],
                  },
                  rows: {
                    key: Card.metadata.ROWS,
                    value: this['rowsBig'],
                  }
                }, FavoritesCardComponent, /* Reference to the component we'd like to spawn */
              ),
            );
          }
        )

      }
    );
  }

  navigateToPrevious() {
    this.navService.resetStack([]);
    this.router.navigateByUrl(this.previousUrl);
  }

  ngOnDestroy(){
    this.UserSubscription.unsubscribe();
    this.favoritesCardsService.resetCards();
  }

}
