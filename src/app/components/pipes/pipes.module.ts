import { NgModule } from '@angular/core';
import { ImagePipe, RichTextPipe, PricePipe, VariantsPipe, DatePipe } from './pipes';

@NgModule({
    declarations: [ImagePipe, 
                   RichTextPipe , 
                   PricePipe,
                   VariantsPipe,
                   DatePipe],
    imports: [
    ],
    exports: [PricePipe,RichTextPipe,VariantsPipe,DatePipe]
  })
  export class PipesModule {
  }