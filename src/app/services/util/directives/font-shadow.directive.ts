import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[dooFontShadow]'
})

export class FontShadowDirective {
    @Input('dooFontShadow') params: string;
    constructor(private el: ElementRef, private renderer: Renderer2) {
    }

    ngOnInit() {
        switch (this.params) {
            case 'Primary':
                this.renderer.addClass(this.el.nativeElement, 'primary-shadow');
                break;
            case 'Accent':
                this.renderer.addClass(this.el.nativeElement, 'accent-shadow');
                break;
            case 'White':
                this.renderer.addClass(this.el.nativeElement, 'white-shadow');
                break;
            case 'Black':
                this.renderer.addClass(this.el.nativeElement, 'black-shadow');
                break;
            default:
        }
    }
}