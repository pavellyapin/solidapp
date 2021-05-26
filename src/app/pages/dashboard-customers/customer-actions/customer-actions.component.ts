import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { map } from 'rxjs/operators';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { ActivatedRoute, Router } from '@angular/router';
import * as AdminActions from 'src/app/services/store/admin/admin.action';
import { ofType, Actions } from '@ngrx/effects';
import { Entry } from 'contentful';

@Component({
    selector: 'app-dashboard-customer-actions',
    templateUrl: './customer-actions.component.html',
    styleUrls: ['./customer-actions.component.scss']
})
export class DashboardCustomerActionsComponent implements OnInit {

    @Input()
    customerId : any;

    @Input()
    customer : any;
    
    @Output() fullfill = new EventEmitter();
    @Output() unfullfill = new EventEmitter();

    SettingsSubscription: Subscription;
    settings$: Observable<Entry<any>>;

    siteSettings: any;

    constructor(private store: Store<{ settings: SettingsState }>,
        private navSerivce: NavigationService,
        private _actions$: Actions,
        public route: ActivatedRoute,
        private router: Router) {

        this.settings$ = store.pipe(select('settings', 'siteConfig'));
    }

    ngOnInit() {
        this.SettingsSubscription = this.settings$
            .pipe(
                map(x => {
                    this.siteSettings = x;
                })
            )
            .subscribe();
    }

    navigateToCustomerOverview() {
        this.navSerivce.startLoading();
        this.router.navigateByUrl('/store/customers');
    }

    ngOnDestroy(): void {
        this.SettingsSubscription.unsubscribe();
    }

}
