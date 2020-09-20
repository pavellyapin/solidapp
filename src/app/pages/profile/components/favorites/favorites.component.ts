import { Component, OnInit } from '@angular/core';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { map, startWith } from 'rxjs/operators';
import { MediaObserver } from '@angular/flex-layout';
import { Card } from 'src/app/components/cards/card';
import { ContentfulService } from 'src/app/services/contentful/contentful.service';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { Router } from '@angular/router';
import UserState from 'src/app/services/store/user/user.state';
import { FavoriteItem } from 'src/app/services/store/user/user.model';
import { ProductCardComponent } from 'src/app/components/cards/product-card/product-card.component';

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
  cols: Observable<number>;
  colsBig: Observable<number>;
  rowsBig: Observable<number>;
  previousUrl: string = '';
  cards: BehaviorSubject<Card[]> = new BehaviorSubject<Card[]>([]);

  constructor(store: Store<{ user: UserState }>,
    private mediaObserver: MediaObserver,
    private contentfulService: ContentfulService,
    private navService: NavigationService,
    private router: Router) {
    this.cards.subscribe(cards => {
      this.favItemsCards = cards;
    });
    this.favorites$ = store.pipe(select('user', 'favorites'));
  }

  ngOnInit() {
    this.navService.getPreviousUrl().forEach((segment) => {
      this.previousUrl = this.previousUrl + '/' + segment
    });

    this.UserSubscription = this.favorites$
      .pipe(
        map(x => {
          if (x) {
            this.favoritesItems = x;
            this.resetCards();
            this.createCards();
            this.navService.finishLoading();
          }
        })
      )
      .subscribe();

    /* Grid column map */
    const colsMap = new Map([
      ['xs', 24],
      ['sm', 16],
      ['md', 18],
      ['lg', 9],
      ['xl', 9],
    ]);
    /* Big card column span map */
    const colsMapBig = new Map([
      ['xs', 12],
      ['sm', 8],
      ['md', 6],
      ['lg', 3],
      ['xl', 3],
    ]);
    /* Small card column span map */
    const rowsMapBig = new Map([
      ['xs', 23],
      ['sm', 13],
      ['md', 11],
      ['lg', 5],
      ['xl', 5],
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

  addCard(card: Card): void {
    this.cards.next(this.cards.getValue().concat(card));
  }

  resetCards(): void {
    this.cards.getValue().splice(0, this.cards.getValue().length);
  }

  createCards(): void {
    this.favoritesItems.forEach((v, index) => {
      this.contentfulService.getProductDetails(v.product.productId).forEach(
        x => {
          if (x) {
            this.addCard(
              new Card(
                {
                  name: {
                    key: Card.metadata.NAME,
                    value: x.fields.title,
                  },
                  index: {
                    key: Card.metadata.INDEX,
                    value: v.docId,
                  },
                  object: {
                    key: Card.metadata.OBJECT,
                    value: x,
                  },
                  cols: {
                    key: Card.metadata.COLS,
                    value: this['colsBig'],
                  },
                  rows: {
                    key: Card.metadata.ROWS,
                    value: this['rowsBig'],
                  },
                  style: {
                    key: Card.metadata.STYLE,
                    value: 'full',
                  }
                }, ProductCardComponent, /* Reference to the component we'd like to spawn */
              ),
            );
          }
        }
      )

    }
    );
  }

  navigateToPrevious() {
    this.navService.resetStack([]);
    this.router.navigateByUrl(this.previousUrl);
  }

  ngOnDestroy() {
    this.UserSubscription.unsubscribe();
    this.resetCards();
  }

}
