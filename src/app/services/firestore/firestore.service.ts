import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AuthService } from '../auth/auth.service';
import { CartData } from 'src/app/pages/cart/payment/payment.component';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {



    constructor(private firestore: AngularFirestore , 
                public authservice: AuthService,
                private firebaseFunctions: AngularFireFunctions) {
    }

    getUserPersonalInfo() {
        return this.firestore.collection("customers").doc("customers").collection(this.authservice.uid)
                        .doc("personalInfo")
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
                        .doc("orders").collection("orders").ref.where("status" , "==" , "paid").get());
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
                    .doc("orders").collection("orders").doc(cart.cartId).update({cart : cart.cart}).then(()=> {
                            return {id : cart.cartId};
                         }
                    ).catch((error)=> {
                        console.error(error);
                    }));
            } else {
                return from (this.firestore
                    .collection("customers").doc("customers").collection(this.authservice.uid)
                    .doc("orders").collection("orders").add({cart : cart.cart , status : "created"}).catch((error)=> {
                        console.error(error);
                    }));
            }

        } else {
            return from (firebase.auth().signInAnonymously().then((creds)=>{
                return this.firestore
                    .collection("customers").doc("customers").collection(creds.user.uid)
                    .doc("orders").collection("orders").add({cart : cart.cart , status : "created"}).catch((error)=> {
                        console.error(error);
                    });
            }).catch(function(error) {
                console.error(error);
              }));
        }
    }


    getOrderStatus(cart : any) {
        return this.firestore.collection("customers").doc("customers").collection(this.authservice.uid)
                        .doc("orders").collection("orders").doc(cart.cartId)
                        .snapshotChanges();
    }

    setOrderShippingInfo (cart : any) : Observable<any>{
        if (this.authservice.uid) {
            return from (this.firestore
                .collection("customers").doc("customers").collection(this.authservice.uid)
                .doc("orders").collection("orders").doc(cart.cartId).update({shipping : cart.shipping ,address : cart.address, personalInfo : cart.personalInfo}));
        } else {
            var initOrder = this.firebaseFunctions.httpsCallable('initOrder');
            return initOrder({"cart" : cart});
        }
    }

    //This method is a listener, mainly for payment section to listen on status changes
    getCart (cartId) : Observable<any>{
        if (this.authservice.uid) {
            return from (this.firestore
                .collection("customers").doc("customers").collection(this.authservice.uid)
                .doc("orders").collection("orders").doc(cartId).snapshotChanges());
        } else {
            var getCart = this.firebaseFunctions.httpsCallable('getCart');
            return getCart({"cartId" : cartId});
        }
    }

    //This is a 1 time data fetch, for success
    getCartData (cartId) : Observable<any>{
        if (this.authservice.uid) {
            return from (this.firestore
                .collection("customers").doc("customers").collection(this.authservice.uid)
                .doc("orders").collection("orders").doc(cartId).get());
        } else {
            var getCart = this.firebaseFunctions.httpsCallable('getCart');
            return getCart({"cartId" : cartId});
        }
    }

    payPalPay (cart : CartData , cardId : string) : Observable<any>{
        var payPalCheckout = this.firebaseFunctions.httpsCallable('pay');
        return payPalCheckout({cart : cart, cartId : cardId , uid : this.authservice.uid});
    }

    setStripeToken (token,cartId) : Observable<any>{
        if (this.authservice.uid) {
            return from (this.firestore
                .collection("customers").doc("customers").collection(this.authservice.uid)
                .doc("orders").collection("orders").doc(cartId).collection('payment').add({payment : {token : token}}));
        } else {
            var setStripeCharge = this.firebaseFunctions.httpsCallable('setStripeCharge');
            return setStripeCharge({token : token , cartId : cartId});
        }
    }

    sendConfirmationEmail (cartId) : Observable<any>{
            var sendConfirmationEmail = this.firebaseFunctions.httpsCallable('sendConfirmationEmail');
            if (this.authservice.uid) {
                return sendConfirmationEmail({uid : this.authservice.uid , cartId : cartId});
            } else {
                return sendConfirmationEmail({cartId : cartId});
            }
            
    }
}