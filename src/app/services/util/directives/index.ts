import { NgModule } from '@angular/core';
import { BackgroundColorDirective } from './background-color.directive';
import { FontColorDirective } from './font-color.directive';
import { FontShadowDirective } from './font-shadow.directive';

@NgModule({
    declarations: [BackgroundColorDirective, FontColorDirective,FontShadowDirective],
    imports: [],
    exports: [BackgroundColorDirective, FontColorDirective,FontShadowDirective],
    providers: [],
    entryComponents: []
})
export class DirectivesModule {
}