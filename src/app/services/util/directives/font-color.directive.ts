import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[dooFontColor]'
})

export class FontColorDirective {
    @Input('dooFontColor') params: string;
    constructor(private el: ElementRef, private renderer: Renderer2) {
    }

    ngOnInit() {
        switch (this.params) {
            case 'Primary':
                this.renderer.addClass(this.el.nativeElement, 'primary-color');
                break;
            case 'Accent':
                this.renderer.addClass(this.el.nativeElement, 'accent-color');
                break;
            case 'White':
                this.renderer.addClass(this.el.nativeElement, 'white-color');
                break;
            case 'Black':
                this.renderer.addClass(this.el.nativeElement, 'black-color');
                break;
            default:
        }
    }
}