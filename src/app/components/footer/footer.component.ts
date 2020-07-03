import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Entry } from 'contentful';
import { Store, select } from '@ngrx/store';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { map } from 'rxjs/operators';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { FormGroup, FormControl } from '@angular/forms';
import * as UserActions from 'src/app/services/store/user/user.action';

@Component({
    selector: 'doo-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
  })
  export class FooterComponent implements OnInit , OnDestroy{

    settings$: Observable<Entry<any>>;
    SettingsSubscription: Subscription;
    footerSections : Entry<any>[];
    footerLinks : Entry<any>[];
    subscribeForm: FormGroup;
  
    constructor(private store: Store<{ settings : SettingsState }> ,
                public navService : NavigationService) {
                  
                  this.settings$ = store.pipe(select('settings','siteConfig'));

                  this.subscribeForm = new FormGroup({        
                    email: new FormControl('')
                });
    }
  
    ngOnInit() {
      this.SettingsSubscription = this.settings$
      .pipe(
        map(x => {
          if (x) {
            this.footerSections = x.fields.footer.filter(section => {if (section.sys.contentType.sys.id == 'block') {return section}});
            this.footerLinks = x.fields.footer.filter(section => {if (section.sys.contentType.sys.id == 'cta') {return section}});
            console.log('footer' , this.footerLinks)
          }
        })
      )
      .subscribe();
    }

    subscribeEmail() {
        this.store.dispatch(UserActions.BeginSubscribeEmailAction({ payload: this.subscribeForm }));
      }
  
    ngOnDestroy(): void {
      this.SettingsSubscription.unsubscribe();
    }


  }