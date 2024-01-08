import {Component , OnInit, Input, ViewChildren, QueryList, Renderer2, ChangeDetectorRef, Output ,EventEmitter} from '@angular/core';

@Component({
  selector: 'doo-review-stars',
  templateUrl: './review-stars.component.html',
  styleUrls: ['./review-stars.component.scss']
})
export class ReviewStarsComponent implements OnInit {

@Input() set rate(rate : any){
    this._rate = rate;
    if (this.rateStars) {
      this.setStarsView();
  }
  
};
_rate : any;
@Input() editable : boolean ;
@Output() starClickEvent : EventEmitter<any> = new EventEmitter();

rateSubmitted : boolean = false;


@ViewChildren("rateStar") rateStars!: QueryList<any>
  
    stars : any = Array(5).fill(0).map((x,i)=>i+1);
    
      constructor(private renderer: Renderer2,private changeDetectorRef: ChangeDetectorRef)
        {
            
        }

  ngOnInit() {
  }

  ngAfterViewInit() {
      this.setStarsView();
  }

  setStarsView() {
    let i = 1;
    this.rateStars.forEach(star=> {
        //remove if any exist aleady
        this.renderer.removeClass(star._elementRef.nativeElement , 'primary-fill');
        this.renderer.removeClass(star._elementRef.nativeElement , 'white-fill');
        this.renderer.setStyle(star._elementRef.nativeElement,'fill','white');

        if ( this._rate >= i) {
            this.renderer.addClass(star._elementRef.nativeElement,'primary-fill');
        } else if (i % this._rate < 1 && i % this._rate != 0) {
            this.renderer.setStyle(star._elementRef.nativeElement,'fill','url(#half)');
        } else {
            this.renderer.addClass(star._elementRef.nativeElement,'white-fill');
        }
        i++;
    })
    this.changeDetectorRef.detectChanges();
  }

  hoverStar(star) {
      if (this.editable) {
        this._rate = star;
        if (!this.rateSubmitted) {
          this.setStarsView();
        }
      }
  }

  starClick(star) {
    if (this.editable) {
        this._rate = star;
        this.rateSubmitted = true;
        this.starClickEvent.emit(star);
        this.setStarsView();
    }
  }


  ngOnDestroy(){
    
  }

}
