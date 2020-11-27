import {Component , OnInit, Inject, Input} from '@angular/core';
import { Card } from '../card';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { map } from 'rxjs/operators';
import { JQ_TOKEN } from 'src/app/services/util/jQuery.service';

@Component({
  selector: 'doo-product-carousel',
  templateUrl: './product-carousel.component.html',
  styleUrls: ['./product-carousel.component.scss']
})
export class ProductCarouselComponent implements OnInit {

    @Input() set productCards(cards : Card[]) {
        this._productCards = cards;
    };
    @Input() width : number;
    @Input() id: any;
    _productCards : Card[];
    resolution$: Observable<string>;
    resolution : any;
    SettingsSubscription : Subscription;
    public bigScreens = new Array('lg' , 'xl' , 'md', 'sm')
    

    constructor(@Inject(JQ_TOKEN) private $:any,
                store: Store<{ settings: SettingsState }>,) {
        this.resolution$ = store.pipe(select('settings' , 'resolution'));
    }
    
    ngOnInit(): void {
        this.SettingsSubscription = this.resolution$
        .pipe(
          map(x => {
            this.resolution = x;
          })
        )
        .subscribe();
      }
      
    

    ngAfterViewInit() {
        this.$('.' + this.id).slick({
            infinite: false,
            slidesToShow: !this.bigScreens.includes(this.resolution)  ? 2 : 4,
            slidesToScroll: !this.bigScreens.includes(this.resolution) ? 2 : 3,
            arrows : false,
            dots : !this.bigScreens.includes(this.resolution),
            adaptiveHeight: true
          });
      }

      flipCarousel(direction:any) {
        if (direction == 'right') {
          this.$('.' + this.id).slick('slickNext');
        } else {
          this.$('.' + this.id).slick('slickPrev');
        }
        
      }
      

      ngOnDestroy(){
        this.$('.' + this.id).slick('unslick');
        this.SettingsSubscription.unsubscribe();
      }

}