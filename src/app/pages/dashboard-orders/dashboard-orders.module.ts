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
import { DashboardOrdersRoutingModule } from './dashboard-orders-routing.module';
import { DashboardOrdersComponent } from './dashboard-orders.component';
import { DashboardOrdersOverviewComponent } from './overview/overview.component';
import { DashboardOrderDetailsComponent } from './order-details/order-details.component';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PipesModule } from 'src/app/components/pipes/pipes.module';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    PipesModule,
    DashboardOrdersRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatTooltipModule,
    FlexLayoutModule,
    LazyLoadImageModule,
  ],
  declarations: [DashboardOrdersComponent,
                 DashboardOrdersOverviewComponent,
                 DashboardOrderDetailsComponent],
  providers: [],
  entryComponents: [],
})
export class DashboardOrdersModule {
}
