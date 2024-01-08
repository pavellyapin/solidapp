import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, QuerySnapshot } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AuthService } from '../../auth/auth.service';
import { environment } from 'src/environments/environment';
import * as firebase from 'firebase';

@Injectable({
    providedIn: 'root',
})
export class FirestoreUserService {

    ordersCollection: string = "orders";

    constructor(private firestore: AngularFirestore,
        public authservice: AuthService,
        private firebaseFunctions: AngularFireFunctions) {
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

    getUserAddressInfo() {
        return this.firestore.collection("customers").doc("customers").collection(this.authservice.uid)
            .doc("address")
            .snapshotChanges();
    }


    updateUserName(firstName, lastName) {
        return from(this.firestore
            .collection("customers").doc("customers").collection(this.authservice.uid)
            .doc("personalInfo").update({
                firstName: firstName,
                lastName: lastName
            }));
    }

    updateUserEmail(email) {
        var updateEmail = this.firebaseFunctions.httpsCallable('updateEmail');
        return updateEmail({ email: email });
    }

    updateUserContact(email, phone) {
        return from(this.firestore
            .collection("customers").doc("customers").collection(this.authservice.uid)
            .doc("personalInfo").update({
                email: email,
                phone: phone
            }));
    }

    updateUserAddress(addressLine1, addressLine2, city, province, postal) {
        return from(this.firestore
            .collection("customers").doc("customers").collection(this.authservice.uid)
            .doc("address").set({
                addressLine1: addressLine1,
                addressLine2: addressLine2,
                city: city,
                province: province,
                postal: postal
            }));
    }

    getOrders(): Observable<QuerySnapshot<DocumentData>> {
        return from(this.firestore.collection("customers").doc("customers").collection(this.authservice.uid)
            .doc(this.ordersCollection).collection("orders").ref.where("status", "==", "paid").get());
    }


    emailSubscribe(form: any): Observable<any> {
        if (this.authservice.uid) {
            return from(this.firestore
                .collection("customers").doc("customers").collection(this.authservice.uid)
                .doc("emails").collection("subscriptions").add({ email: form["email"],date: "" + (new Date()).getTime() }).then((x) => {
                    return { id: x.id };
                }
                ).catch((error) => {
                    console.error(error);
                }));
        } else {
            return from(firebase.default.auth().signInAnonymously().then((creds) => {
                return from(this.firestore
                    .collection("customers").doc("customers").collection(creds.user.uid)
                    .doc("emails").collection("subscriptions").add({ email: form["email"],date: "" + (new Date()).getTime() }).then((x) => {
                        return { id: x.id };
                    }
                    ).catch((error) => {
                        console.error(error);
                    }));
            }).catch(function (error) {
                console.error(error);
            }));
        }
    }

    saveClientForm(form: any): Observable<any> {
        if (this.authservice.uid) {
            return from(this.firestore
                .collection("form").add({ form: form }).then((x) => {
                    return { id: x.id };
                }
                ).catch((error) => {
                    console.error(error);
                }));
        } else {
            return from(firebase.default.auth().signInAnonymously().then((creds) => {
                return this.firestore
                    .collection("form").add({ form: form }).then((x) => {
                        return { id: x.id };
                    }
                    ).catch((error) => {
                        console.error(error);
                    });
            }).catch(function (error) {
                console.error(error);
            }));
        }
    }
}