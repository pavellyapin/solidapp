import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[dooBackground]'
})

export class BackgroundColorDirective {
    @Input('dooBackground') params: string;
    constructor(private el: ElementRef, private renderer: Renderer2) {
    }

    ngOnInit() {
        switch (this.params) {
            case 'Light Primary':
                this.renderer.addClass(this.el.nativeElement, 'primary-background-opacity');
                break;
            case 'Primary':
                this.renderer.addClass(this.el.nativeElement, 'primary-background');
                break;
            case 'Light Accent':
                this.renderer.addClass(this.el.nativeElement, 'accent-background-opacity');
                break;
            case 'Accent':
                this.renderer.addClass(this.el.nativeElement, 'accent-background');
                break;
            case 'White':
                this.renderer.addClass(this.el.nativeElement, 'white-background');
                break;
            case 'Black':
                this.renderer.addClass(this.el.nativeElement, 'black-background');
                break;
            default:
        }
    }
}