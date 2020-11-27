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
import { DashboardCustomersComponent } from './dashboard-customers.component';
import { DashboardCustomersRoutingModule } from './dashboard-customers-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PipesModule } from 'src/app/components/pipes/pipes.module';
import { DashboardCustomerDetailsComponent } from './customer-details/customer-details.component';
import { DashboardCustomersOverviewComponent } from './overview/overview.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmDeleteCustomerModalComponent } from './modals/confirm-delete/confirm-delete.component';

@NgModule({
  imports: [
    CommonModule,
    PipesModule,
    DashboardCustomersRoutingModule,
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
    MatDividerModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatSidenavModule,
    FlexLayoutModule,
    BlockLayoutsModule,
    WidgetsModule
  ],
  declarations: [DashboardCustomersComponent,
                 DashboardCustomersOverviewComponent,
                 DashboardCustomerDetailsComponent,
                 ConfirmDeleteCustomerModalComponent],
  providers: [],
  entryComponents: [ConfirmDeleteCustomerModalComponent],
})
export class DashboardCustomersModule {
}
