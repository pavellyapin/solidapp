import {Component , OnInit, Input, Output, ViewChild} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FavoriteItem } from 'src/app/services/store/user/user.model';
import { EventEmitter } from '@angular/core';
import { MyErrorStateMatcher } from 'src/app/components/pipes/pipes';
import { ProductReviewsComponent } from '../product-reviews/product-reviews.component';

@Component({
  selector: 'doo-product-detail-standard-layout',
  templateUrl: './standard-layout.component.html',
  styleUrls: ['./standard-layout.component.scss', '../product-detail.component.scss']
})
export class ProductDeatilStandardLayoutComponent implements OnInit {

  @Output() favoriteToggle =  new EventEmitter();
  @Output() addToCart =  new EventEmitter();
  @Output() public addQty =  new EventEmitter();
  @Output() public removeQty =  new EventEmitter();

  @Input() productDetails : any;
  @Input() productReviews : any;
  @Input() cartItemForm:FormGroup;
  @Input() productVariants: Map<string,[any]>;
  @Input() isFavorite:FavoriteItem;
  @Input() formSubmit;
  @Input() resolution;

  @ViewChild('reviewsComponent',{static: false}) 
  public reviewsComponent: ProductReviewsComponent;
  

  displayedMediaIndex:number = 0;

      constructor()
        {
          
        }

  ngOnInit() {

  }

  addProductToCart() {
    this.addToCart.emit();
  }

  toggleFavorites(isFavorite) {
    this.favoriteToggle.emit(isFavorite);
  }

  changeImage(index) {
    this.displayedMediaIndex = index;
  }

  ngOnDestroy(){
    
  }

}
