import {Component , OnInit, Input, Output} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FavoriteItem } from 'src/app/services/store/user/user.model';
import { EventEmitter } from '@angular/core';
import { MyErrorStateMatcher } from 'src/app/components/pipes/pipes';

@Component({
  selector: 'doo-product-detail-standard-layout',
  templateUrl: './fashion-layout.component.html',
  styleUrls: ['./fashion-layout.component.scss']
})
export class ProductDeatilStandardLayoutComponent implements OnInit {

  @Output() favoriteToggle =  new EventEmitter();
  @Output() addToCart =  new EventEmitter();

  @Input() productDetails : any;
  @Input() cartItemForm:FormGroup;
  @Input() productVariants: Map<string,[any]>;
  @Input() isFavorite:FavoriteItem;
  matcher = new MyErrorStateMatcher();
  @Input() formSubmit;
  

  displayedMediaIndex:number = 0;

      constructor()
        {
          
        }

  ngOnInit() {

    console.log('productDetails',this.productDetails);
  }

  addProductToCart() {
    this.addToCart.emit();
  }

  toggleFavorites(isFavorite) {
    this.favoriteToggle.emit(isFavorite);
  }

  changeImage(index) {
    
  }

  ngOnDestroy(){
    
  }

}
