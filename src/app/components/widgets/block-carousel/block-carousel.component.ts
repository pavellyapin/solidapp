import {Component , OnInit, Inject, Input} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { map } from 'rxjs/operators';
import { JQ_TOKEN } from 'src/app/services/util/jQuery.service';
import { Entry } from 'contentful';

@Component({
  selector: 'doo-block-carousel',
  templateUrl: './block-carousel.component.html',
  styleUrls: ['./block-carousel.component.scss']
})
export class BlockCarouselComponent implements OnInit {

    @Input() widget :Entry<any>;
    @Input() width : number;
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
        this.$('.' + this.widget.fields.id).slick({
            autoplay: true,
            autoplaySpeed: 3000,
            infinite: false,
            slidesToShow: !this.bigScreens.includes(this.resolution)  ? 1 : 1,
            slidesToScroll: !this.bigScreens.includes(this.resolution) ? 1 : 1,
            arrows : false,
            dots : !this.bigScreens.includes(this.resolution),
            adaptiveHeight: false
          });
      }

      flipCarousel(direction:any) {
        if (direction == 'right') {
          this.$('.' + this.widget.fields.id).slick('slickNext');
        } else {
          this.$('.' + this.widget.fields.id).slick('slickPrev');
        }
        
      }
      

      ngOnDestroy(){
        this.$('.' + this.widget.fields.id).slick('unslick');
        this.SettingsSubscription.unsubscribe();
      }

}