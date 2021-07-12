import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class FirestoreProductsService {


    constructor(private firestore: AngularFirestore , 
                public authservice: AuthService) {
    }

    //Product Reviews

    addProductReview(productId, review) {
        return from(this.firestore
            .collection("products")
            .doc(productId).collection("reviews").add(review));
    }

    getProductReviews(productId) {
        return from(this.firestore.collection("products")
            .doc(productId).collection("reviews").snapshotChanges());
    }

    //Favorites-------------------------------------------------------------------------

    addToFavorites(productId) {
        return from(this.firestore
            .collection("customers").doc("customers").collection(this.authservice.uid)
            .doc("favorites").collection("favorites").add({ productId: productId }));
    }

    removeFromFavorites(docId) {
        return from(this.firestore
            .collection("customers").doc("customers").collection(this.authservice.uid)
            .doc("favorites").collection("favorites").doc(docId).delete());
    }

    getFavorites() {
        return from(this.firestore.collection("customers").doc("customers").collection(this.authservice.uid)
            .doc("favorites").collection("favorites").snapshotChanges());
    }
}