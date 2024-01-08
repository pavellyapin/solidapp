import { Component, OnInit, Inject, Input, ViewChildren, QueryList } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher, sortReviews } from 'src/app/components/pipes/pipes';
import { Store } from '@ngrx/store';
import * as ProductsActions from '../../../services/store/product/product.action';
import { NavigationService } from 'src/app/services/navigation/navigation.service';

@Component({
  selector: 'doo-product-reviews',
  templateUrl: './product-reviews.component.html',
  styleUrls: ['./product-reviews.component.scss']
})
export class ProductReviewsComponent implements OnInit {

  stars: any = Array(5).fill(0).map((x, i) => i + 1).reverse();
  @Input() productDetails: any;
  @Input() set productReviews(reviews: any[]) {
    if (reviews) {
      this._productReviews = reviews.slice(0);
      this._productReviews.sort(sortReviews);
      this.filteredReviews = this._productReviews.slice(0, this.reviewsPerInt);
      this.dialog.closeAll();
    }

  };
  _productReviews: any[];
  filteredReviews: any[];
  reviewsPerInt: number = 3;
  @ViewChildren("starCount") starCount!: QueryList<any>
  filters = new Array<any>();

  constructor(private dialog: MatDialog , private navService: NavigationService) {

  }

  ngOnInit() {

  }

  filterReviews(reviewsCount: number) {
    this.filteredReviews = [];
    this._productReviews.forEach(review => {
      if (this.filterReviewByRate(review) && this.filteredReviews.length < reviewsCount) {
        this.filteredReviews.push(review);
      }
    })
  }

  filterReviewByRate(review): boolean {
    let include = false;
    if (this.filters.length == 0) {
      include = true;
    } else {
      this.filters.forEach(filter => {
        if (review.rate == filter) {
          include = true;
        }
      });
    }
    return include;
  }

  loadMoreReviews() {
    this.filteredReviews = this.filteredReviews.
      concat(this._productReviews.
        slice(this.filteredReviews.length, this.filteredReviews.length + this.reviewsPerInt));

  }

  filterToggle(star) {
    if (!this.filters.includes(star)) {
      this.filters.push(star)
    }
    this.filterReviews(this.reviewsPerInt);
  }

  removeFilterChip(chip) {
    this.filters = this.filters.filter(filter => {
      if (!(filter == chip)) {
        return filter;
      }
    });
    this.filterReviews(this.reviewsPerInt);
  }

  getStarCount(star) {
    let count = 0;
    if (this._productReviews) {
      this._productReviews.forEach(review => {
        if (review.rate == star) {
          count++;
        }
      });
      return count;
    }

    return count;
  }

  getOverallRate() {
    let sum = 0;
    if (this._productReviews) {
      this._productReviews.forEach(review => {
        sum += review.rate;
      });
      return sum / this._productReviews.length;
    }
    return 0;
  }

  getRecommendCount() {
    let count = 0;
    if (this._productReviews) {
      this._productReviews.forEach(review => {
        if (review.recommend) {
          count++;
        }
      });
      return count;
    }
    return 0;
  }

  getRecommendPresent() {
    if (this._productReviews) {
      let count = this.getRecommendCount();
      return (count / this._productReviews.length * 100).toFixed(0);
    }
    return 0;
  }

  writeReviewPopUp() {
    let config;
    config = {
      position: {
        top: '0px',
        right: '0px'
      },
      'max-width': '100vw',
      height: '100%',
      width: '100vw',
      panelClass: 'full-screen-modal',
      data: { productDetails: this.productDetails }
    };
    const dialogRef = this.dialog.open(WriteReviewModalComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.navService.startLoading();
      }
    });
  }



  ngOnDestroy() {

  }

}

@Component({
  selector: 'doo-write-review-modal',
  templateUrl: './write-review-popup/write-review-popup.component.html',
  styleUrls: ['./write-review-popup/write-review-popup.component.scss']
})
export class WriteReviewModalComponent {

  reviewForm: FormGroup;
  formSubmitted: boolean = false;
  matcher = new MyErrorStateMatcher();

  constructor(
    private store: Store<{}>,
    public dialogRef: MatDialogRef<WriteReviewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit() {
    this.reviewForm = new FormGroup({
      rate: new FormControl('', Validators.required),
      recommend: new FormControl(true, Validators.required),
      headline: new FormControl('', Validators.required),
      review: new FormControl('', Validators.required),
      name: new FormControl(''),
      date: new FormControl(Date.now())
    })

  }

  submitReview() {
    this.formSubmitted = true;
    if (this.reviewForm.valid) {
      this.reviewForm.controls["recommend"].
        setValue(this.reviewForm.controls["recommend"].value != 'false' || this.reviewForm.controls["recommend"].value == 'true');
      this.store.dispatch(ProductsActions.BeginWriteProductReviewAction({ payload: { productId: this.data.productDetails.sys.id, review: this.reviewForm.value } }));
      this.dialogRef.close('created');
    }
  }

  starClickEvent(rate) {
    this.reviewForm.controls["rate"].setValue(rate);
  }

  ngOnDestroy() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}