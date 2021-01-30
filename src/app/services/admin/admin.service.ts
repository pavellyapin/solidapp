import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Store, select } from '@ngrx/store';
import AdminState from '../store/admin/admin.state';
import { DashboardModule } from 'src/app/components/dashboard/dashboard.module';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: DashboardModule,
})
export class AdminService {

    env: any;

    constructor(
        private firebaseFunctions: AngularFireFunctions,
        private store: Store<{ admin : AdminState}> ) {
            store.pipe(select('admin','env'))
            .pipe(
              map(x => {
                this.env = x;
              })
            ).subscribe();
    }

    getCustomers() : Observable<any>{
        var getCustomers = this.firebaseFunctions.httpsCallable('admin/getCustomers');
        return getCustomers({});
    }

    getCarts() : Observable<any>{
        var getCarts = this.firebaseFunctions.httpsCallable('admin/getCarts');
        return getCarts({"env" : this.env});
    }

    deleteCustomers(customers : [any]) {
        var deleteCustomers = this.firebaseFunctions.httpsCallable('admin/deleteCustomers');
        return deleteCustomers(customers);
    }

    getCustomerDetails(uid) {
        var getCustomer = this.firebaseFunctions.httpsCallable('admin/getCustomer');
        return getCustomer(uid);
    }

    getCustomerOrders(uid) {
        var getCustomerOrders = this.firebaseFunctions.httpsCallable('admin/getCustomerOrders');
        return getCustomerOrders(uid);
    }

    getOrders() {
        var getOrders = this.firebaseFunctions.httpsCallable('admin/getOrders');
        return getOrders({"env" : this.env});
    }

    getNewOrders() {
        var getNewOrders = this.firebaseFunctions.httpsCallable('admin/getNewOrders');
        return getNewOrders({"env" : this.env});
    }

    getOrderDetails(uid, orderId) {
        var getOrder = this.firebaseFunctions.httpsCallable('admin/getOrder');
        return getOrder({"uid" : uid , "orderId" : orderId , "env" : this.env});
    }

    fullFillOrder(uid, orderId) {
        var fullFillOrder = this.firebaseFunctions.httpsCallable('admin/fulfillOrder');
        return fullFillOrder({"uid" : uid , "orderId" : orderId, "env" : this.env});
    }

    unfullFillOrder(uid, orderId) {
        var unfullFillOrder = this.firebaseFunctions.httpsCallable('admin/unfulfillOrder');
        return unfullFillOrder({"uid" : uid , "orderId" : orderId, "env" : this.env});
    }


}