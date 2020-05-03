import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatGridListModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule,
    MatSidenavModule,
    FlexLayoutModule,
    TranslateModule.forChild(),
  ],
  declarations: [HomeComponent],
  providers: [TranslateService],
  entryComponents: [],
})
export class HomeModule {
}
