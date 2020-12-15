import {Component , OnInit, Input, Output, HostListener, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FavoriteItem } from 'src/app/services/store/user/user.model';
import { EventEmitter } from '@angular/core';
import { MyErrorStateMatcher } from 'src/app/components/pipes/pipes';
import { ProductReviewsComponent } from '../product-reviews/product-reviews.component';

@Component({
  selector: 'doo-product-detail-fashion-layout',
  templateUrl: './fashion-layout.component.html',
  styleUrls: ['./fashion-layout.component.scss','../product-detail.component.scss']
})
export class ProductDeatilFashionLayoutComponent implements OnInit {

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
  @ViewChild('mediaEnd',{static: false}) mediaElementEnd: ElementRef;
  @ViewChild('stickyProductDetail',{static: false}) stickyProductDetail: ElementRef;
  @ViewChild('stickyInnerCont',{static: false}) stickyInnerCont: ElementRef;
  @ViewChild('reviewsComponent',{static: false}) 
  public reviewsComponent: ProductReviewsComponent;

  displayedMediaIndex:number = 0;
  zoomed : boolean = false;
  matcher = new MyErrorStateMatcher();
  bigScreens = new Array('lg' , 'xl' , 'md')
  
  

      constructor(private renderer: Renderer2)
        {
          window.addEventListener('scroll', this.checkScroll.bind(this), {passive:true});
        }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.stickyInnerCont.nativeElement.focus();
  }

  addProductToCart() {
    
    this.addToCart.emit();
  }

  toggleFavorites(isFavorite) {
    this.favoriteToggle.emit(isFavorite);
  }

  mediaZoom(zoom) {
    this.zoomed = zoom;
  }

  checkScroll() {
    if (window.scrollY > this.mediaElementEnd.nativeElement.offsetHeight - (this.bigScreens.includes(this.resolution) ? 550 : 800)) {
      if (this.bigScreens.includes(this.resolution)) {
        this.renderer.removeClass(this.stickyProductDetail.nativeElement, 'sticky-product-detail');
        this.renderer.removeClass(this.stickyInnerCont.nativeElement, 'sticky-inner-cont');
      } else {
        this.renderer.removeClass(this.stickyProductDetail.nativeElement, 'sticky-product-detail-mobile');
        this.renderer.removeClass(this.stickyInnerCont.nativeElement, 'sticky-inner-cont');
      }
    } else {
      if (this.bigScreens.includes(this.resolution)) {
        this.renderer.addClass(this.stickyProductDetail.nativeElement, 'sticky-product-detail');
        this.renderer.addClass(this.stickyInnerCont.nativeElement, 'sticky-inner-cont');
      } else {
        this.renderer.addClass(this.stickyProductDetail.nativeElement, 'sticky-product-detail-mobile');
        this.renderer.removeClass(this.stickyInnerCont.nativeElement, 'sticky-inner-cont');
      }
    }
  } 

  ngOnDestroy(){
    window.removeEventListener('scroll', this.checkScroll.bind(this));
  }

}
