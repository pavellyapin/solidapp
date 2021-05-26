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
import { DashboardOrderActionsComponent } from './order-actions/order-actions.component';
import { CartCardsModule } from 'src/app/components/cart-card/cards.module';
import { MatChipsModule } from '@angular/material/chips';
import { ConfirmFullfillOrderModalComponent } from './modals/confirm-fullfill/confirm-fulfill.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmUnFullfillOrderModalComponent } from './modals/confirm-unfullfill/confirm-unfulfill.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    PipesModule,
    DashboardOrdersRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatTableModule,
    MatChipsModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatTooltipModule,
    FlexLayoutModule,
    LazyLoadImageModule,
    CartCardsModule,
    BlockLayoutsModule
  ],
  declarations: [DashboardOrdersComponent,
                 DashboardOrdersOverviewComponent,
                 DashboardOrderDetailsComponent,
                 DashboardOrderActionsComponent,
                 ConfirmFullfillOrderModalComponent,
                 ConfirmUnFullfillOrderModalComponent],
  providers: [],
  entryComponents: [],
})
export class DashboardOrdersModule {
}
