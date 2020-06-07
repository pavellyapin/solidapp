import {Component , OnInit, Inject, Input} from '@angular/core';
import { JQ_TOKEN } from '../jQuery.service';
import { Card } from '../card';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { map } from 'rxjs/operators';

@Component({
  selector: 'doo-product-carousel',
  templateUrl: './product-carousel.component.html',
  styleUrls: ['./product-carousel.component.scss']
})
export class ProductCarouselComponent implements OnInit {

    @Input() set productCards(cards : Card[]) {
        this._productCards = cards;
    };
    _productCards : Card[];
    resolution$: Observable<string>;
    resolution : any;
    SettingsSubscription : Subscription;

    constructor(@Inject(JQ_TOKEN) private $:any,
                store: Store<{ settings: SettingsState }>) {
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
        this.$('.doo-carousel').slick({
            infinite: true,
            slidesToShow: this.resolution == 'xs' ? 1 : 4,
            slidesToScroll: this.resolution == 'xs' ? 1 : 3,
            adaptiveHeight: true,
            arrows : false,
            dots : true
          });
      }

      ngOnDestroy(){
        this.$('.doo-carousel').slick('unslick');
        this.SettingsSubscription.unsubscribe();
      }

}