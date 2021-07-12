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
import { MatChipsModule } from '@angular/material/chips';
import { CartCardsModule } from 'src/app/components/cart-card/cards.module';
import { DashboardSubscriptionsRoutingModule } from './dashboard-subscriptions-routing.module';
import { DashboardSubscriptionsComponent } from './dashboard-subscriptions.component';
import { DashboardSubscriptionsOverviewComponent } from './overview/overview.component';
import { ConfirmDeleteSubscriptionModalComponent } from './modals/confirm-delete/confirm-delete.component';
import { DashboardSubscriptionsActionsComponent } from './subscriptions-actions/subscriptions-actions.component';
import { DashboardSubscriptionDetailsComponent } from './subscription-details/subscription-details.component';
import { ConfirmReviewSubscriptionModalComponent } from './modals/confirm-review/confirm-review.component';
import { ConfirmUnReviewSubscriptionModalComponent } from './modals/confirm-unreview/confirm-unreview.component';
import { SendEmailModalComponent } from './modals/send-email/send-email.component';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    DashboardSubscriptionsRoutingModule,
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
    MatRadioModule,
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
  declarations: [DashboardSubscriptionsComponent,
                 DashboardSubscriptionsOverviewComponent,
                 ConfirmDeleteSubscriptionModalComponent,
                 DashboardSubscriptionsActionsComponent,
                 DashboardSubscriptionDetailsComponent,
                 ConfirmReviewSubscriptionModalComponent,
                 ConfirmUnReviewSubscriptionModalComponent,
                 SendEmailModalComponent
                ],
  providers: [],
  entryComponents: [ConfirmDeleteSubscriptionModalComponent],
})
export class DashboardSubscriptionsModule {
}
