import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavModule } from './components/nav/nav.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ConfigService } from './services/config/config.service';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { StoreModule, ActionReducer, MetaReducer } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UserReducer } from './services/store/user/user.reducer';
import { UserEffects } from './services/store/user/user.effects';
import { SettingsEffects } from './services/store/settings/settings.effects';
import { SettingsReducer } from './services/store/settings/settings.reducer';
import { CartReducer } from './services/store/cart/cart.reducer';
import { PipesModule } from './components/pipes/pipes.module';
import { localStorageSync } from 'ngrx-store-localstorage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule} from '@angular/fire/functions';
import { ProductsReducer } from './services/store/product/product.reducer';
import { ProductsEffects } from './services/store/product/product.effects';
import { CartEffects } from './services/store/cart/cart.effects';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { AdminReducer } from './services/store/admin/admin.reducer';
import { AdminEffects } from './services/store/admin/admin.effects';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { JQ_TOKEN } from './services/util/jQuery.service';
import { jQuery } from './components/cards/cards.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({ keys: ['user', 'cart'], rehydrate: true })(reducer);
}
const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    DeviceDetectorModule,
    NavModule,
    DashboardModule,
    PipesModule,
    FlexLayoutModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireFunctionsModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    StoreModule.forRoot({
      user: UserReducer,
      admin: AdminReducer,
      settings: SettingsReducer,
      products: ProductsReducer,
      cart: CartReducer
    }, { metaReducers }),
    EffectsModule.forRoot([UserEffects, AdminEffects,
      SettingsEffects,
      ProductsEffects,
      CartEffects]),
    !environment.production ? StoreDevtoolsModule.instrument({
       maxAge: 25, // Retains last 25 states
       logOnly: true, // Restrict extension to log-only mode
       stateSanitizer: (x) => ({ hidden: "Inclusion crashes devtools" })
     }) : [], 
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json'),
        deps: [HttpClient],
      },
    })
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (config: ConfigService) => () => config.init(),
      deps: [
        ConfigService, TranslateService,
      ],
      multi: true,
    },
    {provide: JQ_TOKEN , useValue:jQuery}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
