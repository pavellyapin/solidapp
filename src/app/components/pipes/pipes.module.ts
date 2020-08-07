import { NgModule } from '@angular/core';
import { ImagePipe, RichTextPipe, PricePipe, VariantsPipe, DatePipe, RatePipe, TimeAgoPipe, PricePipeSimple } from './pipes';

@NgModule({
    declarations: [ImagePipe, 
                   RichTextPipe , 
                   PricePipe,
                   VariantsPipe,
                   DatePipe,
                   RatePipe,
                   TimeAgoPipe,
                   PricePipeSimple],
    imports:      [
    ],
    exports: [PricePipe,
              ImagePipe,
              RichTextPipe,
              VariantsPipe,
              DatePipe,
              TimeAgoPipe,
              RatePipe,
              PricePipeSimple]
  })
  export class PipesModule {
  }