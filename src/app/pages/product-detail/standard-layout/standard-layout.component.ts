import { Component, OnInit, Input, Output, ViewChild, Renderer2 } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FavoriteItem } from 'src/app/services/store/user/user.model';
import { EventEmitter } from '@angular/core';
import { ProductReviewsComponent } from '../product-reviews/product-reviews.component';
import { MatButton } from '@angular/material/button';
import { Actions, ofType } from '@ngrx/effects';
import * as CartActions from '../../../services/store/cart/cart.action';

@Component({
  selector: 'doo-product-detail-standard-layout',
  templateUrl: './standard-layout.component.html',
  styleUrls: ['./standard-layout.component.scss', '../product-detail.component.scss']
})
export class ProductDeatilStandardLayoutComponent implements OnInit {

  @Output() favoriteToggle = new EventEmitter();
  @Output() addToCart = new EventEmitter();
  @Output() variantPriceChange = new EventEmitter();
  @Output() public addQty = new EventEmitter();
  @Output() public removeQty = new EventEmitter();

  @Input() productDetails: any;
  @Input() productReviews: any;
  @Input() cartItemForm: FormGroup;
  @Input() productVariants: Map<string, [any]>;
  @Input() variantPrice: any;
  @Input() variantDiscount: any;
  @Input() isFavorite: FavoriteItem;
  @Input() formSubmit;
  @Input() resolution;

  @ViewChild('reviewsComponent', { static: false })
  public reviewsComponent: ProductReviewsComponent;

  @ViewChild('addProductBtn', { static: false })
  public addProductButton: MatButton;


  displayedMediaIndex: number = 0;

  constructor(private renderer: Renderer2, private _actions$: Actions) {

  }

  ngOnInit() {

    this._actions$.pipe(ofType(
      CartActions.SuccessBackGroundInitializeOrderAction)).subscribe(() => {
        this.renderer.removeClass(this.addProductButton._elementRef.nativeElement, 'button-loading');
        this.addProductButton.disabled = false;
      });

  }

  getProductPrice($event) {
    this.variantPriceChange.emit($event);
  }

  addProductToCart() {
    this.renderer.addClass(this.addProductButton._elementRef.nativeElement, 'button-loading');
    this.addProductButton.disabled = true;
    this.addToCart.emit();
  }

  toggleFavorites(isFavorite) {
    this.favoriteToggle.emit(isFavorite);
  }

  changeImage(index) {
    this.displayedMediaIndex = index;
  }

  ngOnDestroy() {

  }

}
