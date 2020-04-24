import {Component, Injector, OnInit} from '@angular/core';
import { AbstractCardComponent } from 'src/app/components/cards/abstract-card-component';
import { Card } from 'src/app/components/cards/card';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { Router } from '@angular/router';
import * as UserActions from '../../../../../../services/store/user/user.action';
import { Store } from '@ngrx/store';

@Component({
  selector: 'doo-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class FavoritesCardComponent extends AbstractCardComponent implements OnInit {

  imageIndex:number = 0;

  constructor(injector: Injector , 
              private navigationService: NavigationService,
              private store: Store<{}>,
              private router: Router) {
    super(injector.get(Card.metadata.NAME),
      injector.get(Card.metadata.INDEX),
      injector.get(Card.metadata.OBJECT),
      injector.get(Card.metadata.ROUTERLINK),
      injector.get(Card.metadata.COLS),
      injector.get(Card.metadata.ROWS));
  }

  ngOnInit() {
    //console.log(this);
  }

  goToProduct() {
    this.navigationService.resetStack([]);
    this.router.navigateByUrl(this.routerLink);
  }

  removeFromFavorites() {
    this.store.dispatch(UserActions.BeginRemoveFromFavoritesAction({payload : this.index}));
  }

  mouseEnter() {
    if (this.object.fields.media.length > 1) {
      this.imageIndex = 1;
    }
  }

  mouseLeave() {
    this.imageIndex = 0;
  }

}
