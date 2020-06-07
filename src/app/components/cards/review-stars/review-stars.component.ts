import {Component , OnInit, Input, ViewChildren, QueryList, Renderer2, ChangeDetectorRef, Output ,EventEmitter} from '@angular/core';

@Component({
  selector: 'doo-review-stars',
  templateUrl: './review-stars.component.html',
  styleUrls: ['./review-stars.component.scss']
})
export class ReviewStarsComponent implements OnInit {

@Input() rate : number;
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
        this.renderer.setStyle(star._elementRef.nativeElement , 'fill' , 'white')

        if ( this.rate >= i) {
            this.renderer.setStyle(star._elementRef.nativeElement,'fill','url(' + window.location.href + '#full)');
        } else if (i % this.rate < 1 && i % this.rate != 0) {
            this.renderer.setStyle(star._elementRef.nativeElement,'fill','url(' + window.location.href + '#half)');
        } else {
            this.renderer.setStyle(star._elementRef.nativeElement,'fill','url(' + window.location.href + '#empty)');
        }
        i++;
    })
    this.changeDetectorRef.detectChanges();
  }

  hoverStar(star) {
      if (this.editable) {
        this.rate = star;
        if (!this.rateSubmitted) {
          this.setStarsView();
        }
      }
  }

  starClick(star) {
    if (this.editable) {
        this.rate = star;
        this.rateSubmitted = true;
        this.starClickEvent.emit(star);
        this.setStarsView();
    }
  }


  ngOnDestroy(){
    
  }

}
