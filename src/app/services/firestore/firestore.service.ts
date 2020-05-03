import { Injectable } from '@angular/core';
import { AngularFirestore, Action, DocumentSnapshot } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AuthService } from '../auth/auth.service';
import { CartData } from 'src/app/pages/cart/payment/payment.component';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {



    constructor(private firestore: AngularFirestore , 
                public authservice: AuthService,
                private firebaseFunctions: AngularFireFunctions) {
    }

    createUser(user) {
        return new Promise<any>((resolve, reject) =>{
            this.firestore
                .collection(user.uid)
                .doc("personalInfo")
                .set(user.personalInfo)
                .then(res => {}, err => reject(err));
        });
    }

    getUserPersonalInfo() {
        return this.firestore.collection(this.authservice.uid)
                        .doc("personalInfo")
                        .snapshotChanges();
    }

    getUserAddressInfo() {
        return this.firestore.collection(this.authservice.uid)
                        .doc("address")
                        .snapshotChanges();
    }


    updateUserName(firstName,lastName) {
        return from (this.firestore
            .collection(this.authservice.uid)
            .doc("personalInfo").update({firstName:firstName,
                  lastName:lastName}));
    }

    updateUserEmail (email) {
        var updateEmail = this.firebaseFunctions.httpsCallable('updateEmail');
        return updateEmail({email: email});
    }

    updateUserContact(email,phone) {
        return from (this.firestore
            .collection(this.authservice.uid)
            .doc("personalInfo").update({email:email,
                  phone:phone}));
    }

    updateUserAddress(addressLine1, addressLine2 , city , province , postal) {
        return from (this.firestore
            .collection(this.authservice.uid)
            .doc("address").set({
                addressLine1:addressLine1,
                addressLine2:addressLine2,
                city:city,
                province:province,
                postal:postal}));
    }

    //Favorites-------------------------------------------------------------------------

    addToFavorites(productId) {
        return from (this.firestore
            .collection(this.authservice.uid)
            .doc("favorites").collection("favorites").add({productId : productId}));
    }

    removeFromFavorites(docId) {
        return from (this.firestore
            .collection(this.authservice.uid)
            .doc("favorites").collection("favorites").doc(docId).delete());
    }

    getFavorites() {
        return from (this.firestore.collection(this.authservice.uid)
                        .doc("favorites").collection("favorites").snapshotChanges());
    }

    //Orders-------------------------------------------------------------------------

    getOrders() : Observable<firebase.firestore.QuerySnapshot> {
        return from (this.firestore.collection(this.authservice.uid)
                        .doc("orders").collection("orders").ref.where("status" , "==" , "paid").get());
    }


    //Payments------------------------------------------------------------------------

    initOrder (cart : any) : Observable<any>{
        if (this.authservice.uid) {
            if (cart.cartId) {
                return from (this.firestore
                    .collection(this.authservice.uid)
                    .doc("orders").collection("orders").doc(cart.cartId).update({cart : cart.cart}).then(()=> {
                            return {id : cart.cartId};
                         }
                    ));
            } else {
                return from (this.firestore
                    .collection(this.authservice.uid)
                    .doc("orders").collection("orders").add({cart : cart.cart , status : "created"}));
            }

        } else {
            var initOrder = this.firebaseFunctions.httpsCallable('initOrder');
            return initOrder({"cart" : cart, status : "created"});
        }
    }

    setOrderShippingInfo (address,personalInfo,cartId) : Observable<any>{
        if (this.authservice.uid) {
            return from (this.firestore
                .collection(this.authservice.uid)
                .doc("orders").collection("orders").doc(cartId).update({shipping : address , personalInfo : personalInfo}));
        } else {
            var setShipping = this.firebaseFunctions.httpsCallable('setShipping');
            return setShipping({address : address, personalInfo : personalInfo, cartId : cartId});
        }
    }

    getCart (cartId) : Observable<any>{
         if (this.authservice.uid) {
            return from (this.firestore
                .collection(this.authservice.uid)
                .doc("orders").collection("orders").doc(cartId).snapshotChanges());
        } else {
            var getCart = this.firebaseFunctions.httpsCallable('getCart');
            return getCart({"cartId" : cartId});
        }
    }

    payPalPay (cart : CartData , cardId : string) : Observable<any>{
        var payPalCheckout = this.firebaseFunctions.httpsCallable('pay');
        return payPalCheckout({cart : cart, cartId : cardId , uid : this.authservice.uid});
    }
}