import {Component, OnInit, Input, Output, EventEmitter, Renderer2, ViewChild, ElementRef, ViewChildren, QueryList} from '@angular/core';
import { FavoriteItem } from 'src/app/services/store/user/user.model';
import { StateChange } from 'ng-lazyload-image';


@Component({
  selector: 'doo-product-card-standard-layout',
  templateUrl: './product-card-standard.component.html',
  styleUrls: ['./product-card-standard.component.scss']
})
export class StandardProductCardComponent implements OnInit {

  imageIndex:number = 0;
  @Input() productReviews : any;
  @Input() isFavorite:FavoriteItem;
  @Input() rate : any;
  @Input() object : any;
  @Input() showReviews : boolean;
  @Input() showVariants : boolean;
  @Input() resolution :any;
  bigScreens = new Array('lg' , 'xl' , 'md');
  @Input() productVariants: Map<string,[any]> = new Map();

  @Output() favoriteToggle =  new EventEmitter();
  @Output() navigateToProduct =  new EventEmitter();

  @ViewChildren("cardImg") mediaElements!: QueryList<any>

  constructor(private renderer: Renderer2) {
  }

  ngOnInit() {

  }

  myCallbackFunction(event: StateChange) {
    switch (event.reason) {
      case 'setup':
        // The lib has been instantiated but we have not done anything yet.
        break;
      case 'observer-emit':
        // The image observer (intersection/scroll observer) has emit a value so we
        // should check if the image is in the viewport.
        // `event.data` is the event in this case.
        break;
      case 'start-loading':
        // The image is in the viewport so the image will start loading
        break;
      case 'mount-image':
        // The image has been loaded successfully so lets put it into the DOM
        break;
      case 'loading-succeeded':
        this.mediaElements.forEach(img=>{
          this.renderer.removeClass(img.nativeElement , 'card-placeholder');
        })
        // The image has successfully been loaded and placed into the DOM
        break;
      case 'loading-failed':
        // The image could not be loaded for some reason.
        // `event.data` is the error in this case
        break;
      case 'finally':
        // The last event before cleaning up
        break;
    }
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
