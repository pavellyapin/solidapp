import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Store, select } from '@ngrx/store';
import UserState from '../store/user/user.state';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
    providedIn: 'root',
})
export class AdminService {

    site$: Observable<any>;
    SiteSubscription: Subscription;
    root: any;

    constructor(
        private http: HttpClient,
        private store: Store<{ user: UserState }>,
        private firebaseFunctions: AngularFireFunctions) {

        this.site$ = store.pipe(select('user', 'site'));
        this.SiteSubscription = this.site$
            .pipe(
                map(x => {
                    if (x) {
                        this.root = x.root;
                    } else {
                        this.root = null;
                    }
                })
            )
            .subscribe();
    }

    getCustomers() : Observable<any>{
        var getCustomers = this.firebaseFunctions.httpsCallable('admin/getCustomers');
        console.log(getCustomers({}));
        return getCustomers({});

        console.log('this.root',this.root);
        if (this.root) {
            return this.http.get(this.root + 'admin/getCustomers');
        }
    }

    deleteCustomers(customers : [any]) {
        if (this.root) {
            return this.http.post(this.root + 'admin/deleteCustomers',customers);
        }
    }

    getCustomerDetails(uid) {
        if (this.root) {
            let params = new HttpParams().set('uid', uid);
            return this.http.get(this.root + 'admin/getCustomer', { params: params });
        }

    }

    getCustomerOrders(uid) {
        if (this.root) {
            let params = new HttpParams().set('uid', uid);
            return this.http.get(this.root + 'admin/getCustomerOrders',{ params: params });
        }
    }

    getOrders() {
        if (this.root) {
            return this.http.get(this.root + 'admin/getOrders');
        }
    }

    getOrderDetails(uid, orderId) {
        if (this.root) {
            let params = new HttpParams().set('orderId', orderId).set('uid', uid);
            return this.http.get(this.root + 'admin/getOrder', { params: params });
        }
    }


}