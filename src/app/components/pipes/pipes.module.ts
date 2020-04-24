import { NgModule } from '@angular/core';
import { ImagePipe, RichTextPipe, PricePipe, VariantsPipe } from './pipes';

@NgModule({
    declarations: [ImagePipe, 
                   RichTextPipe , 
                   PricePipe,
                   VariantsPipe],
    imports: [
    ],
    exports: [PricePipe,RichTextPipe,VariantsPipe]
  })
  export class PipesModule {
  }