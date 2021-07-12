import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { UtilitiesService } from '../util.service';
import { NavigationService } from '../../navigation/navigation.service';

@Directive({
    selector: '[dooImgStyle]'
})

export class ImgStyleDirective {
    @Input('dooImgStyle') params: any;
    constructor(private el: ElementRef, private renderer: Renderer2, private utils: UtilitiesService, public navService: NavigationService) {
    }

    ngOnInit() {
        if (this.params.block.fields.media) {
            if (!this.params.block.fields.media[0].fields.file.details.image) {
                if (this.el.nativeElement.localName == "img") {
                    this.renderer.removeChild(this.el.nativeElement.parentElement, this.el.nativeElement);
                } else {
                    this.renderer.setProperty(this.el.nativeElement, "src", this.params.block.fields.media[0].fields.file.url);
                    this.setStyle(this.el.nativeElement);
                    this.setClick(this.el.nativeElement);
                }
            } else {
                if (this.el.nativeElement.localName == "video") {
                    this.renderer.removeChild(this.el.nativeElement.parentElement, this.el.nativeElement);
                } else {
                    if (this.params.block.fields.media[0].fields.file.contentType == "image/svg+xml") {
                        const embed = this.renderer.createElement('embed');
                        this.renderer.setProperty(embed, "src", this.params.block.fields.media[0].fields.file.url);
                        this.renderer.setProperty(embed, "type", "image/svg+xml");
    
                        this.setStyle(embed);
                        this.renderer.insertBefore(this.el.nativeElement.parentElement, embed, this.renderer.nextSibling(this.el.nativeElement));
                        this.renderer.removeChild(this.el.nativeElement.parentElement, this.el.nativeElement);
                        this.setClick(embed);
                        
                    } else {
                        this.setStyle(this.el.nativeElement);
                        this.setClick(this.el.nativeElement);
                    }
                }
            } 
        } else {
            this.renderer.removeChild(this.el.nativeElement.parentElement, this.el.nativeElement);
        }
    }

    setStyle(element) {
        if (this.utils.bigScreens.includes(this.params.resolution)) {
            this.renderer.setStyle(element, "width",
                (this.params.block.fields.textBoxWidth ? this.params.block.fields.textBoxWidth + '%' : '100%'));
            this.renderer.setStyle(element, "padding-left", '0px');
            this.renderer.setStyle(element, "padding-right", '0px');

        } else {
            this.renderer.addClass(this.el.nativeElement.parentElement, "crop");
            this.renderer.setStyle(element, "width",
                (this.params.block.fields.mobileMediaWidth ? this.params.block.fields.mobileMediaWidth : '100%'))
            this.renderer.setStyle(element, "padding-left",
                (this.params.block.fields.mobileMediaLeftPadding ? this.params.block.fields.mobileMediaLeftPadding : '0px'));
            this.renderer.setStyle(element, "padding-right",
                (this.params.block.fields.mobileMediaLeftPadding ? this.params.block.fields.mobileMediaLeftPadding : '0px'));
        }
        this.renderer.setProperty(element, "alt", this.params.block.fields.media[0].fields.description);
    }

    setClick(element) {
        if (this.params.block.fields.imageAction) {
            this.renderer.listen(element, 'click', (event) => {
                if (this.params.block.fields.imageAction.fields.action) {
                    this.navService.ctaClick(this.params.block.fields.imageAction.fields.action)
                } else {
                    this.navService.navigateExternalURL(this.params.block.fields.imageAction.fields.externalUrl);
                }
            })
            this.renderer.addClass(element, "doo-pointer");
        }
    }
}