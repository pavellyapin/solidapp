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
                  'doo-profile-round',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/profile-round.svg")
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
                  'doo-facebook-color',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/facebook-color.svg")
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
                  'doo-google-color',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/google-color.svg")
                );

                this.matIconRegistry.addSvgIcon(
                  'doo-location',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/location.svg")
                );

                this.matIconRegistry.addSvgIcon(
                  'doo-email',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/email.svg")
                );

                
                this.matIconRegistry.addSvgIcon(
                  'doo-lock',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/lock.svg")
                );

                this.matIconRegistry.addSvgIcon(
                  'doo-close',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/close.svg")
                );

                this.matIconRegistry.addSvgIcon(
                  'doo-search',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/search.svg")
                );

                this.matIconRegistry.addSvgIcon(
                  'doo-add',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/add.svg")
                );

                this.matIconRegistry.addSvgIcon(
                  'doo-cc',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/cc.svg")
                );

                this.matIconRegistry.addSvgIcon(
                  'doo-visa',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/visa.svg")
                );

                this.matIconRegistry.addSvgIcon(
                  'doo-mastercard',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/mastercard.svg")
                );

                this.matIconRegistry.addSvgIcon(
                  'doo-amex',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/amex.svg")
                );

                this.matIconRegistry.addSvgIcon(
                  'doo-discover',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/discover.svg")
                );
                this.matIconRegistry.addSvgIcon(
                  'doo-plus',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/plus.svg")
                );
                this.matIconRegistry.addSvgIcon(
                  'doo-minus',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/minus.svg")
                );
                this.matIconRegistry.addSvgIcon(
                  'doo-hamburger',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/hamburger.svg")
                );
                this.matIconRegistry.addSvgIcon(
                  'doo-phone',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/phone.svg")
                );
                this.matIconRegistry.addSvgIcon(
                  'doo-box',
                  this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/box.svg")
                );
  }
}
