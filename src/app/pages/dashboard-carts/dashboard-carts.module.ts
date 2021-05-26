import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { WidgetsModule } from 'src/app/components/widgets/widgets.module';
import { BlockLayoutsModule } from 'src/app/components/block-layouts/block-layouts.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PipesModule } from 'src/app/components/pipes/pipes.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardCartsOverviewComponent } from './overview/overview.component';
import { ConfirmDeleteCartModalComponent } from './modals/confirm-delete/confirm-delete.component';
import { DashboardCartsRoutingModule } from './dashboard-carts-routing.module';
import { DashboardCartsComponent } from './dashboard-carts.component';
import { MatChipsModule } from '@angular/material/chips';
import { DashboardCartActionsComponent } from './cart-actions/cart-actions.component';
import { DashboardCartDetailsComponent } from './cart-details/cart-details.component';
import { ConfirmReviewCartModalComponent } from './modals/confirm-review/confirm-review.component';
import { ConfirmUnReviewCartModalComponent } from './modals/confirm-unreview/confirm-unreview.component';
import { CartCardsModule } from 'src/app/components/cart-card/cards.module';

@NgModule({
  imports: [
    CommonModule,
    PipesModule,
    DashboardCartsRoutingModule,
    TranslateModule,
    MatGridListModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatMenuModule,
    MatChipsModule,
    MatDividerModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatSidenavModule,
    FlexLayoutModule,
    BlockLayoutsModule,
    WidgetsModule,
    CartCardsModule
  ],
  declarations: [DashboardCartsComponent,
                 DashboardCartsOverviewComponent,
                 ConfirmDeleteCartModalComponent,
                 DashboardCartActionsComponent,
                 DashboardCartDetailsComponent,
                 ConfirmReviewCartModalComponent,
                 ConfirmUnReviewCartModalComponent
                ],
  providers: [],
  entryComponents: [ConfirmDeleteCartModalComponent],
})
export class DashboardCartsModule {
}
