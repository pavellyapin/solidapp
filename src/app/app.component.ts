import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ux';

  constructor (translate: TranslateService,
               private matIconRegistry: MatIconRegistry,
               private domSanitizer: DomSanitizer,) {
                // this language will be used as a fallback when a translation isn't found in the current language
                translate.setDefaultLang('en');

                // the lang to use, if the lang isn't available, it will use the current loader to get them
               translate.use('en');

               
                this.matIconRegistry.addSvgIcon(
                  'doo-basket',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/basket.svg")
                );

                this.matIconRegistry.addSvgIcon(
                  'doo-profile',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/profile.svg")
                );

                this.matIconRegistry.addSvgIcon(
                  'doo-favorite',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/favorite.svg")
                );

                this.matIconRegistry.addSvgIcon(
                  'doo-filters',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/filters.svg")
                );
                this.matIconRegistry.addSvgIcon(
                  'doo-approved',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/approved-green.svg")
                );
                this.matIconRegistry.addSvgIcon(
                  'paypal',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/paypal.svg")
                );

                this.matIconRegistry.addSvgIcon(
                  'doo-star-outline',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/star-outline.svg")
                );
  }
}
