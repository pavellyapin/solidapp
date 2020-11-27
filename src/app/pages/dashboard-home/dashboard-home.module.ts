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
import { WidgetsModule } from 'src/app/components/widgets/widgets.module';
import { BlockLayoutsModule } from 'src/app/components/block-layouts/block-layouts.module';
import { DashboardHomeRoutingModule } from './dashboard-home-routing.module';
import { DashboardHomeComponent } from './dashboard-home.component';

@NgModule({
  imports: [
    CommonModule,
    DashboardHomeRoutingModule,
    MatGridListModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule,
    MatSidenavModule,
    FlexLayoutModule,
    BlockLayoutsModule,
    WidgetsModule
  ],
  declarations: [DashboardHomeComponent],
  providers: [],
  entryComponents: [],
})
export class DashboardHomeModule {
}
