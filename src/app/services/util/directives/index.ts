import { NgModule } from '@angular/core';
import { BackgroundColorDirective } from './background-color.directive';
import { FontColorDirective } from './font-color.directive';
import { FontShadowDirective } from './font-shadow.directive';
import { ImgStyleDirective } from './img-style.directive';

@NgModule({
    declarations: [BackgroundColorDirective, FontColorDirective,FontShadowDirective,ImgStyleDirective],
    imports: [],
    exports: [BackgroundColorDirective, FontColorDirective,FontShadowDirective,ImgStyleDirective],
    providers: [],
    entryComponents: []
})
export class DirectivesModule {
}