import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NavToolbarComponent } from './nav-toolbar/nav-toolbar.component';
import { PipesModule } from '../pipes/pipes.module';
import { BreadCrumbsComponent } from './bread-crumbs/bread-crumbs.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatGridListModule} from '@angular/material/grid-list';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatMenuModule} from '@angular/material/menu';
import {MatBadgeModule} from '@angular/material/badge';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { FooterModule } from '../footer/footer.module';
import { MobileSideNavComponent } from './mobile-side-nav/mobile-side-nav.component';
import { CartSideNavComponent } from './cart-side-nav/cart-side-nav.component';
import { CartCardsModule } from '../cart-card/cards.module';
import { BlockLayoutsModule } from '../block-layouts/block-layouts.module';

@NgModule({
  declarations: [NavComponent, 
                 NavToolbarComponent,
                 BreadCrumbsComponent,
                 MobileSideNavComponent,
                 CartSideNavComponent],
  imports: [
    CommonModule,
    RouterModule,
    FooterModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    TranslateModule,
    MatSidenavModule,
    FlexLayoutModule,
    MatListModule,
    MatGridListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatExpansionModule,
    MatMenuModule,
    MatBadgeModule,
    PipesModule,
    LazyLoadImageModule,
    CartCardsModule,
    BlockLayoutsModule
  ],
  providers : [],
  exports:[BreadCrumbsComponent],
  entryComponents: []
})
export class NavModule {
}
