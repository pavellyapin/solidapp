import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FavoriteItem } from 'src/app/services/store/user/user.model';


@Component({
  selector: 'doo-cart-card-fashion-layout',
  templateUrl: './cart-card-fashion.component.html',
  styleUrls: ['./cart-card-fashion.component.scss']
})
export class FashionCartCardComponent implements OnInit {

  imageIndex:number = 0;
  @Input() isFavorite:FavoriteItem;
  @Input() object:any;
 
  @Output() favoritesEmmitter =  new EventEmitter();
  @Output() cartEmmitter =  new EventEmitter();
  @Output() navigateToProduct =  new EventEmitter();

  constructor() {
  }

  ngOnInit() {
    
  }

  toggleFavorites(isFavorite) {
    this.favoritesEmmitter.emit(isFavorite);
  }

  goToProduct() {
    this.navigateToProduct.emit();
  }

  removeFromCart(){
    this.cartEmmitter.emit();
  }
}
