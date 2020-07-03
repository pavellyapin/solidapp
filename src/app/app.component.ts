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
                'doo-logo',
                this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/logo.svg")
                );

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

                this.matIconRegistry.addSvgIcon(
                  'doo-arrow-left',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/arrow-left.svg")
                );

                this.matIconRegistry.addSvgIcon(
                  'doo-arrow-right',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/arrow-right.svg")
                );

                this.matIconRegistry.addSvgIcon(
                  'doo-arrow-down',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/arrow-down.svg")
                );

                this.matIconRegistry.addSvgIcon(
                  'doo-twitter',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/twitter.svg")
                );

                this.matIconRegistry.addSvgIcon(
                  'doo-facebook',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/facebook.svg")
                );
                this.matIconRegistry.addSvgIcon(
                  'doo-insta',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/insta.svg")
                );
                this.matIconRegistry.addSvgIcon(
                  'doo-youtube',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/youtube.svg")
                );
                this.matIconRegistry.addSvgIcon(
                  'doo-linkedin',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/linkedin.svg")
                );
                this.matIconRegistry.addSvgIcon(
                  'doo-googleplus',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/googleplus.svg")
                );

                this.matIconRegistry.addSvgIcon(
                  'doo-location',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/location.svg")
                );
                
  }
}
