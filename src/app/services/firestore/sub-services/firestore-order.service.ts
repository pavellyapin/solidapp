import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { AngularFireFunctions } from '@angular/fire/functions';
import { CartData } from 'src/app/pages/cart/payment/payment.component';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/auth.service';

@Injectable({
    providedIn: 'root',
})
export class FirestoreOrderService {


    ordersCollection: string = "orders";

    constructor(private firestore: AngularFirestore,
        public authservice: AuthService,
        private firebaseFunctions: AngularFireFunctions) {
        console.log('environment.production', environment.production);
        if (!environment.production) {
            this.ordersCollection = "testOrders"
        }
    }

    initOrder(cart: any): Observable<any> {
        if (this.authservice.uid) {
            if (cart.cartId) {
                return from(this.firestore
                    .collection("customers").doc("customers").collection(this.authservice.uid)
                    .doc(this.ordersCollection).collection("orders").doc(cart.cartId).update({ cart: cart.cart }).then(() => {
                        return { id: cart.cartId };
                    }
                    ).catch((error) => {
                        console.error(error);
                    }));
            } else {
                return from(this.firestore
                    .collection("customers").doc("customers").collection(this.authservice.uid)
                    .doc(this.ordersCollection).collection("orders").add({ cart: cart.cart, status: "created" }).catch((error) => {
                        console.error(error);
                    }));
            }

        } else {
            return from(firebase.default.auth().signInAnonymously().then((creds) => {
                return this.firestore
                    .collection("customers").doc("customers").collection(creds.user.uid)
                    .doc(this.ordersCollection).collection("orders").add({ cart: cart.cart, status: "created" }).catch((error) => {
                        console.error(error);
                    });
            }).catch(function (error) {
                console.error(error);
            }));
        }
    }


    getOrderStatus(cart: any) {
        return this.firestore.collection("customers").doc("customers").collection(this.authservice.uid)
            .doc(this.ordersCollection).collection("orders").doc(cart.cartId)
            .snapshotChanges();
    }

    setOrderStatus(cartId: any, status: any): Observable<any> {
        return from(this.firestore.collection("customers").doc("customers").collection(this.authservice.uid)
            .doc(this.ordersCollection).collection("orders").doc(cartId).update({ status: status }));
    }

    setOrderShippingInfo(cart: any): Observable<any> {
        if (this.authservice.uid) {
            return from(this.firestore
                .collection("customers").doc("customers").collection(this.authservice.uid)
                .doc(this.ordersCollection).collection("orders").doc(cart.cartId).update({ shipping: cart.shipping, address: cart.address, personalInfo: cart.personalInfo }));
        }
    }

    //This method is a listener, mainly for payment section to listen on status changes
    getCart(cartId): Observable<any> {
        if (this.authservice.uid) {
            return from(this.firestore
                .collection("customers").doc("customers").collection(this.authservice.uid)
                .doc(this.ordersCollection).collection("orders").doc(cartId).snapshotChanges());
        }
    }

    //This is a 1 time data fetch, for success
    getCartData(cartId): Observable<any> {
        if (this.authservice.uid) {
            return from(this.firestore
                .collection("customers").doc("customers").collection(this.authservice.uid)
                .doc(this.ordersCollection).collection("orders").doc(cartId).get());
        }
    }

    payPalPay(cart: CartData, cardId: string): Observable<any> {
        var payPalCheckout = this.firebaseFunctions.httpsCallable('paypal/pay');
        return payPalCheckout({ cart: cart, cartId: cardId, uid: this.authservice.uid });
    }

    setStripeToken(token, cartId): Observable<any> {
        if (this.authservice.uid) {
            return from(this.firestore
                .collection("customers").doc("customers").collection(this.authservice.uid)
                .doc(this.ordersCollection).collection("orders").doc(cartId).collection('payment').add({ payment: { token: token } }));
        }
    }
}