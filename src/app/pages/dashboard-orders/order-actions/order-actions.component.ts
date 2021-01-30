import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { map } from 'rxjs/operators';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { ActivatedRoute } from '@angular/router';
import * as AdminActions from 'src/app/services/store/admin/admin.action';
import { ofType, Actions } from '@ngrx/effects';
import { Entry } from 'contentful';

@Component({
    selector: 'app-dashboard-order-actions',
    templateUrl: './order-actions.component.html',
    styleUrls: ['./order-actions.component.scss']
})
export class DashboardOrderActionsComponent implements OnInit {

    @Input()
    orderId : any;

    @Input()
    order : any;
    
    @Output() fullfill = new EventEmitter();
    @Output() unfullfill = new EventEmitter();

    SettingsSubscription: Subscription;
    settings$: Observable<Entry<any>>;

    siteSettings: any;

    constructor(private store: Store<{ settings: SettingsState }>,
        private navSerivce: NavigationService,
        private _actions$: Actions,
        public route: ActivatedRoute) {

        this.settings$ = store.pipe(select('settings', 'siteConfig'));
    }

    ngOnInit() {
        console.log('%%%--',this.order);

        this.SettingsSubscription = this.settings$
            .pipe(
                map(x => {
                    this.siteSettings = x;
                })
            )
            .subscribe();
    }

    ngOnDestroy(): void {
        this.SettingsSubscription.unsubscribe();
    }

}
