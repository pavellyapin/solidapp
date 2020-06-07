import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { PostLayoutsModule } from 'src/app/components/post-layouts/post-layouts.module';
import { CustomComponent } from './custom.component';
import { CustomRoutingModule } from './custom-routing.module';

@NgModule({
  imports: [
    CommonModule,
    CustomRoutingModule,
    MatGridListModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule,
    MatSidenavModule,
    FlexLayoutModule,
    PostLayoutsModule,
  ],
  declarations: [CustomComponent],
  providers: [],
  entryComponents: [],
})
export class CustomModule {
}
