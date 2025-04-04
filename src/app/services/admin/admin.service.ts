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
        private store: Store<{ admin : AdminState}>) {
            store.pipe(select('admin','env'))
            .pipe(
              map(x => {
                this.env = x;
              })
            ).subscribe();
            
    }

    statsForPeriod(quickLook?:string,startDate?:any,endDate?:any) {
        var statsForPeriod = this.firebaseFunctions.httpsCallable('admin/statsForPeriod');
        return statsForPeriod({"quickLook" : quickLook ,"startDate":startDate, "env" : this.env});

    }

    getCustomers() : Observable<any>{
        var getCustomers = this.firebaseFunctions.httpsCallable('admin/getCustomers');
        return getCustomers({"env" : this.env});
    }

    getCustomerDetails(uid) {
        var getCustomer = this.firebaseFunctions.httpsCallable('admin/getCustomer');
        return getCustomer({"uid" : uid , "env" : this.env});
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

    deliverOrder(uid, orderId) {
        var deliverOrder = this.firebaseFunctions.httpsCallable('admin/deliverOrder');
        return deliverOrder({"uid" : uid , "orderId" : orderId, "env" : this.env});
    }

    undeliverOrder(uid, orderId) {
        var undeliverOrder = this.firebaseFunctions.httpsCallable('admin/undeliverOrder');
        return undeliverOrder({"uid" : uid , "orderId" : orderId, "env" : this.env});
    }

    fullFillOrder(uid, orderId) {
        var fullFillOrder = this.firebaseFunctions.httpsCallable('admin/fulfillOrder');
        return fullFillOrder({"uid" : uid , "orderId" : orderId, "env" : this.env});
    }

    unfullFillOrder(uid, orderId) {
        var unfullFillOrder = this.firebaseFunctions.httpsCallable('admin/unfulfillOrder');
        return unfullFillOrder({"uid" : uid , "orderId" : orderId, "env" : this.env});
    }

    getCarts() : Observable<any>{
        var getCarts = this.firebaseFunctions.httpsCallable('admin/getCarts');
        return getCarts({"env" : this.env});
    }

    deleteCarts(carts : [any]) {
        var deleteCarts = this.firebaseFunctions.httpsCallable('admin/deleteCarts');
        return deleteCarts({"carts" : carts , "env" : this.env});
    }

    getCartDetails(uid, cartId) {
        var getCart = this.firebaseFunctions.httpsCallable('admin/getOrder');
        return getCart({"uid" : uid , "orderId" : cartId , "env" : this.env});
    }

    reviewCart(uid, cartId) {
        var reviewCart = this.firebaseFunctions.httpsCallable('admin/reviewCart');
        return reviewCart({"uid" : uid , "orderId" : cartId, "env" : this.env});
    }

    unreviewCart(uid, cartId) {
        var unreviewCart = this.firebaseFunctions.httpsCallable('admin/unReviewCart');
        return unreviewCart({"uid" : uid , "orderId" : cartId, "env" : this.env});

    }

    getSubscriptions() : Observable<any>{
        var getSubscriptions = this.firebaseFunctions.httpsCallable('admin/getSubscriptions');
        return getSubscriptions({"env" : this.env});
    }

    deleteSubscriptions(subscriptions : [any]) {
        var deleteSubscriptions = this.firebaseFunctions.httpsCallable('admin/deleteSubscriptions');
        return deleteSubscriptions({"subscriptions" : subscriptions , "env" : this.env});
    }

    getSubscriptionDetails(uid, subscriptionId) {
        var getSubscription = this.firebaseFunctions.httpsCallable('admin/getSubscription');
        return getSubscription({"uid" : uid , "subscriptionId" : subscriptionId , "env" : this.env});
    }

    reviewSubscription(uid, subscriptionId) {
        var reviewSubscription = this.firebaseFunctions.httpsCallable('admin/reviewSubscription');
        return reviewSubscription({"uid" : uid , "subscriptionId" : subscriptionId, "env" : this.env});
    }

    unreviewSubscription(uid, subscriptionId) {
        var unreviewSubscription = this.firebaseFunctions.httpsCallable('admin/unReviewSubscription');
        return unreviewSubscription({"uid" : uid , "subscriptionId" : subscriptionId, "env" : this.env});

    }

    sendEmail(uid, subscriptionId, email) {
        var sendEmail = this.firebaseFunctions.httpsCallable('admin/sendEmail');
        return sendEmail({"uid" : uid , "subscriptionId" : subscriptionId, "email": email, "env" : this.env});

    }


}