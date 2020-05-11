import { NgModule } from '@angular/core';
import { FullWidthImgBackgroundPostComponent } from './full-width-img-background/full-width-img-background.component';
import { PostLayoutComponent } from './post-layouts.component';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PipesModule } from '../pipes/pipes.module';
import { MatButtonModule } from '@angular/material/button';
import { SplitScreenImagePostComponent } from './split-screen-img/split-screen-img.component';

@NgModule({
    declarations: [FullWidthImgBackgroundPostComponent,
                   SplitScreenImagePostComponent,
                   PostLayoutComponent],
    imports: [
        CommonModule,
        PipesModule,
        FlexLayoutModule,
        MatButtonModule,
    ],
    exports: [FullWidthImgBackgroundPostComponent,
              SplitScreenImagePostComponent,
              PostLayoutComponent]
  })
  export class PostLayoutsModule {
  }