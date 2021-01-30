import { Component, Input, Inject, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { JQ_TOKEN } from 'src/app/services/util/jQuery.service';
import { UtilitiesService } from 'src/app/services/util/util.service';

@Component({
    selector: 'cart-flow-header',
    templateUrl: './flow-header.component.html',
    styleUrls: ['./flow-header.component.scss',]
})
export class CartFlowHeaderComponent {

    
    @Input() set currentStep(step:any) {
        this._currentStep = step;
        if (step && this.viewInit && !this.utilService.bigScreens.includes(this.resolution)) {
          this.$('.doo-cart-steps').slick('slickGoTo',this.steps.indexOf(this._currentStep));
        }
    
      };
      _currentStep: any;

    @Input()
    resolution: any;

    @Output() stepClickedEmitter = new EventEmitter();

    steps: string[] = ["guest", "shipping", "payment"];
    viewInit:boolean = false;

    constructor(@Inject(JQ_TOKEN) private $: any, 
    public utilService: UtilitiesService) {

    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        if (!this.utilService.bigScreens.includes(this.resolution)) {
            this.$('.doo-cart-steps').slick({
                autoplay: false,
                infinite: false,
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                dots: false,
                adaptiveHeight: false
            });
            if (this._currentStep) {
                this.$('.doo-cart-steps').slick('slickGoTo',this.steps.indexOf(this._currentStep));
            }
        }
        this.viewInit = true;
    }

    isCurrentStep(step) {
        return this._currentStep == step;
    }

    stepClicked(step) {
        if (this.steps.indexOf(this._currentStep) > this.steps.indexOf(step) ) {
            this.stepClickedEmitter.emit(step);
        }
    }

    ngOnDestroy() {
    }
}