import { NgModule } from '@angular/core';
import { BlockLayoutComponent } from './block-layouts.component';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PipesModule } from '../pipes/pipes.module';
import { MatButtonModule } from '@angular/material/button';
import { SplitScreenImagePostComponent } from './split-screen-img/split-screen-img.component';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import { BackgroundImageBlockComponent } from './background-img/background-img.component';
import { TextBlockComponent } from './text/text.component';
import { MatIconModule } from '@angular/material/icon';
import { ActionsComponent } from './actions/actions.component';
import { CardPostComponent } from './card/card.component';
import { RowOfTwoPostComponent } from './row-of-two/row-of-two.component';

@NgModule({
    declarations: [BackgroundImageBlockComponent,
                   TextBlockComponent,
                   SplitScreenImagePostComponent,
                   BlockLayoutComponent,
                   ActionsComponent,
                   CardPostComponent,
                   RowOfTwoPostComponent],
    imports: [
        CommonModule,
        PipesModule,
        LazyLoadImageModule,
        FlexLayoutModule,
        MatButtonModule,
        MatIconModule
    ],
    exports: [BlockLayoutComponent]
  })
  export class BlockLayoutsModule {
  }