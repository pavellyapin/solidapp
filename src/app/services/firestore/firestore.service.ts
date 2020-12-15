import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AuthService } from '../auth/auth.service';
import { CartData } from 'src/app/pages/cart/payment/payment.component';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {


    ordersCollection: string = "orders";

    constructor(private firestore: AngularFirestore , 
                public authservice: AuthService,
                private firebaseFunctions: AngularFireFunctions) {
                    console.log('environment.production',environment.production);
                    if (!environment.production) {
                        this.ordersCollection = "testOrders"
                    }
    }

    getUserPersonalInfo() {
        return this.firestore.collection("customers").doc("customers").collection(this.authservice.uid)
                        .doc("personalInfo")
                        .snapshotChanges();
    }

    getUserPermissions() {
        return this.firestore.collection("customers").doc("customers").collection(this.authservice.uid)
                        .doc("permissions")
                        .snapshotChanges();
    }

    getUserSiteInfo() {
        return this.firestore.collection("customers").doc("customers").collection(this.authservice.uid)
                        .doc("site")
                        .snapshotChanges();
    }

    getUserAddressInfo() {
        return this.firestore.collection("customers").doc("customers").collection(this.authservice.uid)
                        .doc("address")
                        .snapshotChanges();
    }


    updateUserName(firstName,lastName) {
        return from (this.firestore
            .collection("customers").doc("customers").collection(this.authservice.uid)
            .doc("personalInfo").update({firstName:firstName,
                  lastName:lastName}));
    }

    updateUserEmail (email) {
        var updateEmail = this.firebaseFunctions.httpsCallable('updateEmail');
        return updateEmail({email: email});
    }

    updateUserContact(email,phone) {
        return from (this.firestore
            .collection("customers").doc("customers").collection(this.authservice.uid)
            .doc("personalInfo").update({email:email,
                  phone:phone}));
    }

    updateUserAddress(addressLine1, addressLine2 , city , province , postal) {
        return from (this.firestore
            .collection("customers").doc("customers").collection(this.authservice.uid)
            .doc("address").set({
                addressLine1:addressLine1,
                addressLine2:addressLine2,
                city:city,
                province:province,
                postal:postal}));
    }

    //Product Reviews

    addProductReview(productId , review) {
        return from (this.firestore
            .collection("products")
            .doc(productId).collection("reviews").add(review));
    }

    getProductReviews(productId) {
            return from (this.firestore.collection("products")
            .doc(productId).collection("reviews").snapshotChanges());
    }

    //Favorites-------------------------------------------------------------------------

    addToFavorites(productId) {
        return from (this.firestore
            .collection("customers").doc("customers").collection(this.authservice.uid)
            .doc("favorites").collection("favorites").add({productId : productId}));
    }

    removeFromFavorites(docId) {
        return from (this.firestore
            .collection("customers").doc("customers").collection(this.authservice.uid)
            .doc("favorites").collection("favorites").doc(docId).delete());
    }

    getFavorites() {
        return from (this.firestore.collection("customers").doc("customers").collection(this.authservice.uid)
                        .doc("favorites").collection("favorites").snapshotChanges());
    }

    //Orders-------------------------------------------------------------------------

    getOrders() : Observable<any> {
        return from (this.firestore.collection("customers").doc("customers").collection(this.authservice.uid)
                        .doc(this.ordersCollection).collection("orders").ref.where("status" , "==" , "paid").get());
    }

    //Subscribe-----------------------------------------------------------------------


    subscribe(email : string) {
        var subscribeEmail = this.firebaseFunctions.httpsCallable('subscribeEmail');
        return subscribeEmail({email : email});
    }

    //Payments------------------------------------------------------------------------

    initOrder (cart : any) : Observable<any>{
        if (this.authservice.uid) {
            if (cart.cartId) {
                return from (this.firestore
                    .collection("customers").doc("customers").collection(this.authservice.uid)
                    .doc(this.ordersCollection).collection("orders").doc(cart.cartId).update({cart : cart.cart}).then(()=> {
                            return {id : cart.cartId};
                         }
                    ).catch((error)=> {
                        console.error(error);
                    }));
            } else {
                return from (this.firestore
                    .collection("customers").doc("customers").collection(this.authservice.uid)
                    .doc(this.ordersCollection).collection("orders").add({cart : cart.cart , status : "created"}).catch((error)=> {
                        console.error(error);
                    }));
            }

        } else {
            return from (firebase.auth().signInAnonymously().then((creds)=>{
                return this.firestore
                    .collection("customers").doc("customers").collection(creds.user.uid)
                    .doc(this.ordersCollection).collection("orders").add({cart : cart.cart , status : "created"}).catch((error)=> {
                        console.error(error);
                    });
            }).catch(function(error) {
                console.error(error);
              }));
        }
    }


    getOrderStatus(cart : any) {
        return this.firestore.collection("customers").doc("customers").collection(this.authservice.uid)
                        .doc(this.ordersCollection).collection("orders").doc(cart.cartId)
                        .snapshotChanges();
    }

    setOrderStatus(cartId : any , status : any) : Observable<any>{
        return from (this.firestore.collection("customers").doc("customers").collection(this.authservice.uid)
                        .doc(this.ordersCollection).collection("orders").doc(cartId).update({status : status}));
    }

    setOrderShippingInfo (cart : any) : Observable<any>{
        if (this.authservice.uid) {
            return from (this.firestore
                .collection("customers").doc("customers").collection(this.authservice.uid)
                .doc(this.ordersCollection).collection("orders").doc(cart.cartId).update({shipping : cart.shipping ,address : cart.address, personalInfo : cart.personalInfo}));
        } 
    }

    //This method is a listener, mainly for payment section to listen on status changes
    getCart (cartId) : Observable<any>{
        if (this.authservice.uid) {
            return from (this.firestore
                .collection("customers").doc("customers").collection(this.authservice.uid)
                .doc(this.ordersCollection).collection("orders").doc(cartId).snapshotChanges());
        } 
    }

    //This is a 1 time data fetch, for success
    getCartData (cartId) : Observable<any>{
        if (this.authservice.uid) {
            return from (this.firestore
                .collection("customers").doc("customers").collection(this.authservice.uid)
                .doc(this.ordersCollection).collection("orders").doc(cartId).get());
        } 
    }

    payPalPay (cart : CartData , cardId : string) : Observable<any>{
        var payPalCheckout = this.firebaseFunctions.httpsCallable('paypal/pay');
        return payPalCheckout({cart : cart, cartId : cardId , uid : this.authservice.uid});
    }

    setStripeToken (token,cartId) : Observable<any>{
        if (this.authservice.uid) {
            return from (this.firestore
                .collection("customers").doc("customers").collection(this.authservice.uid)
                .doc(this.ordersCollection).collection("orders").doc(cartId).collection('payment').add({payment : {token : token}}));
        } 
    }
}