import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { map } from 'rxjs/operators';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Entry } from 'contentful';

@Component({
    selector: 'app-dashboard-cart-actions',
    templateUrl: './cart-actions.component.html',
    styleUrls: ['./cart-actions.component.scss']
})
export class DashboardCartActionsComponent implements OnInit {

    @Input()
    orderId : any;

    @Input()
    order : any;
    
    @Output() review = new EventEmitter();
    @Output() unreview = new EventEmitter();

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

    navigateToCartOverview() {
        this.navSerivce.startLoading();
        this.router.navigateByUrl('/store/carts');
    }

    ngOnDestroy(): void {
        this.SettingsSubscription.unsubscribe();
    }

}
