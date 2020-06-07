import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FavoriteItem } from 'src/app/services/store/user/user.model';


@Component({
  selector: 'doo-product-card-fashion-layout',
  templateUrl: './product-card-fashion.component.html',
  styleUrls: ['./product-card-fashion.component.scss']
})
export class FashionProductCardComponent implements OnInit {

  imageIndex:number = 0;
  @Input() productReviews : any;
  @Input() isFavorite:FavoriteItem;
  @Input() rate : any;
  @Input() object : any;
  @Input() productVariants: Map<string,[any]> = new Map();

  @Output() favoriteToggle =  new EventEmitter();
  @Output() navigateToProduct =  new EventEmitter();

  constructor() {
  }

  ngOnInit() {

  }

  goToProduct() {
    this.navigateToProduct.emit();
  }

  toggleFavorites(isFavorite) {
    this.favoriteToggle.emit(isFavorite);
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
