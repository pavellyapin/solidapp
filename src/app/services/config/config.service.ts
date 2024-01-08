import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as SettingsActions from 'src/app/services/store/settings/settings.action';
import { TranslateService } from '@ngx-translate/core';
import { PixelService } from 'ngx-pixel';
import { environment } from 'src/environments/environment';
import * as firebase from 'firebase';
import { SEOService } from '../seo/seo.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {

  constructor(private store: Store<{}>, translate: TranslateService,
    private pixel: PixelService, private seoService: SEOService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
  }

  init() {
    this.store.dispatch(SettingsActions.BeginLoadingAction());
    this.store.dispatch(SettingsActions.BeginLoadSettingsAction());
    this.store.dispatch(SettingsActions.BeginGetActiveCategoriesAction());
    this.store.dispatch(SettingsActions.BeginGetAllPagesAction());
    this.store.dispatch(SettingsActions.BeginSetResolutionAction());

    this.seoService.createLinkForCanonicalURL();

    if (environment.production) {
      firebase.default.analytics();
      this.pixel.track('PageView');
    }

    if (environment.storeEnabled) {
      window["stripeKey"] = environment.stripeKey;
    }
  }
}
