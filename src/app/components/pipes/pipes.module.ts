import { NgModule } from '@angular/core';
import { ImagePipe, RichTextPipe, PricePipe, VariantsPipe, DatePipe, RatePipe, TimeAgoPipe } from './pipes';

@NgModule({
    declarations: [ImagePipe, 
                   RichTextPipe , 
                   PricePipe,
                   VariantsPipe,
                   DatePipe,
                   RatePipe,
                   TimeAgoPipe],
    imports:      [
    ],
    exports: [PricePipe,
              ImagePipe,
              RichTextPipe,
              VariantsPipe,
              DatePipe,
              TimeAgoPipe,
              RatePipe]
  })
  export class PipesModule {
  }