import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { from } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import * as UserActions from '../store/user/user.action';
import * as CartActions from '../store/cart/cart.action';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  uid: any;
  idToken: any;
  isRedirect: boolean = false;
  isAnonymous: any;
  authReady$ = new BehaviorSubject<any>({});

  constructor(public afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<{}>) {
    firebase.default.auth().setPersistence(firebase.default.auth.Auth.Persistence.LOCAL);
    firebase.default.auth().getRedirectResult()
    .then(res => {
      if(res.user) {
        this.uid = res.user.uid;
        this.isRedirect = true;
        this.isAnonymous = res.user.isAnonymous;
        if (res.additionalUserInfo.isNewUser) {
          this.firestore
          .collection("customers")
          .doc("customers")
          .collection(res.user.uid)
          .doc("personalInfo")
          .set({
            email: res.additionalUserInfo.profile["email"],
            firstName: res.additionalUserInfo.providerId == 'facebook.com' ? 
            (res.additionalUserInfo.profile["first_name"] ? res.additionalUserInfo.profile["first_name"] : '') : 
            (res.additionalUserInfo.profile["given_name"] ? res.additionalUserInfo.profile["given_name"] : '') ,
            lastName: res.additionalUserInfo.providerId == 'facebook.com' ? 
            (res.additionalUserInfo.profile["first_name"] ? res.additionalUserInfo.profile["first_name"] : '') : 
            (res.additionalUserInfo.profile["given_name"] ? res.additionalUserInfo.profile["given_name"] : '') ,
            phone: '',
            provider: res.additionalUserInfo.providerId
          }).then((x)=>{
            this.store.dispatch(UserActions.BeginPostLoginAction());
          });
        } else {
          this.store.dispatch(UserActions.BeginPostLoginAction());
        }
      }
    });
    this.afAuth.authState.subscribe(
      (auth) => {
        if (auth != null) {
          this.uid = auth.uid;
          this.authReady$.next(auth.uid);
          this.idToken = auth.getIdToken();
          this.isAnonymous = auth.isAnonymous;

        } else {
          this.uid = null;
        }
      });
  }

  postLogin() {
    return from(new Promise<any>((resolve, reject) => {
      this.afAuth.currentUser
        .then(auth => {
          if(!auth.isAnonymous) {
            this.uid = auth.uid;
            this.store.dispatch(CartActions.BeginResetCartIdAction());
            this.store.dispatch(CartActions.SuccessSetGuestFlowAction({ payload: false }));
            this.store.dispatch(UserActions.BeginGetUserInfoAction());
            this.store.dispatch(UserActions.BeginGetUserPermissionsAction());
            this.store.dispatch(UserActions.BeginSetUserIDAction({ payload: auth.uid }));
            this.store.dispatch(UserActions.BeginGetUserAddressInfoAction());
            this.store.dispatch(CartActions.
            BeginBackGroundInitializeCartAction({
              payload: {
                cartId: null,
                cart: null
              }
            }));
          }
          resolve(auth);
        }, err => reject(err));
    }));
  }

  doLogin(email, password): Observable<any> {
    return from(new Promise<any>((resolve, reject) => {
      firebase.default.auth().signInWithEmailAndPassword(email, password)
        .then(res => {
          resolve(res);
        }, err => reject(err));
    }));
  }

  signInWithRedirect(provider) {
    return from(new Promise<any>((resolve, reject) => {
      firebase.default.auth().signInWithRedirect(provider == 'google' ? new firebase.default.auth.GoogleAuthProvider() : new firebase.default.auth.FacebookAuthProvider());
    }));
  }

  doLoginWithGoogle() {
    return from(new Promise<any>((resolve, reject) => {
        firebase.default.auth().signInWithPopup(new firebase.default.auth.GoogleAuthProvider())
          .then(res => {
            if (res.additionalUserInfo.isNewUser) {
              this.firestore
                .collection("customers")
                .doc("customers")
                .collection(res.user.uid)
                .doc("personalInfo")
                .set({
                  email: res.additionalUserInfo.profile["email"],
                  firstName: res.additionalUserInfo.profile["given_name"] ? res.additionalUserInfo.profile["given_name"] : '',
                  lastName: res.additionalUserInfo.profile["family_name"] ? res.additionalUserInfo.profile["family_name"] : '',
                  phone: '',
                  provider: 'google'
                })

            }
            resolve(res);
          }, err => reject(err));
      
    }));
  }

  doLoginWithFacebook() {
    return from(new Promise<any>((resolve, reject) => {
      if (this.uid) {
        firebase.default.auth().signOut().then(() => {
          firebase.default.auth().signInWithPopup(new firebase.default.auth.FacebookAuthProvider())
            .then(res => {
              if (res.additionalUserInfo.isNewUser) {
                this.firestore
                  .collection("customers")
                  .doc("customers")
                  .collection(res.user.uid)
                  .doc("personalInfo")
                  .set({
                    email: res.additionalUserInfo.profile["email"],
                    firstName: res.additionalUserInfo.profile["first_name"] ? res.additionalUserInfo.profile["first_name"] : '',
                    lastName: res.additionalUserInfo.profile["last_name"] ? res.additionalUserInfo.profile["last_name"] : '',
                    phone: '',
                    provider: 'facebook'
                  })

              }
              resolve(res);
            }, err => reject(err));
        });
      } else {
        firebase.default.auth().signInWithPopup(new firebase.default.auth.FacebookAuthProvider())
          .then(res => {
            if (res.additionalUserInfo.isNewUser) {
              this.firestore
                .collection("customers")
                .doc("customers")
                .collection(res.user.uid)
                .doc("personalInfo")
                .set({
                  email: res.additionalUserInfo.profile["email"],
                  firstName: res.additionalUserInfo.profile["first_name"] ? res.additionalUserInfo.profile["first_name"] : '',
                  lastName: res.additionalUserInfo.profile["last_name"] ? res.additionalUserInfo.profile["last_name"] : '',
                  phone: '',
                  provider: 'facebook'
                })

            }
            resolve(res);
          }, err => reject(err));
      }
    }));
  }

  doLogout() {
    return from(new Promise((resolve, reject) => {
      if (firebase.default.auth().currentUser) {
        this.afAuth.signOut();
        this.uid = null;
        this.idToken = null;
        resolve();
      } else {
        reject();
      }
    }));
  }

  doRegister(email, password) {
    return from(new Promise<any>((resolve, reject) => {
      if (this.uid) {
        firebase.default.auth().signOut().then(() => {
          firebase.default.auth().createUserWithEmailAndPassword(email, password)
            .then(res => {
              this.firestore
                .collection("customers")
                .doc("customers")
                .collection(res.user.uid)
                .doc("personalInfo")
                .set({
                  email: email,
                  firstName: '',
                  lastName: '',
                  phone: '',
                  provider: 'email'
                })

              resolve(res);
            }, err => reject(err));
        });
      } else {
        firebase.default.auth().createUserWithEmailAndPassword(email, password)
          .then(res => {
            this.firestore
              .collection("customers")
              .doc("customers")
              .collection(res.user.uid)
              .doc("personalInfo")
              .set({
                email: email,
                firstName: '',
                lastName: '',
                phone: '',
                provider: 'email'
              })
            resolve(res);
          }, err => reject(err));
      }
    }));
  }


  updatePassword(password, newPassword) {
    let credentials = firebase.default.auth.EmailAuthProvider.credential(
      firebase.default.auth().currentUser.email, password);

    return from(new Promise<any>((resolve, reject) => {
      firebase.default.auth().currentUser.reauthenticateWithCredential(credentials).then(
        () => {
          firebase.default.auth().currentUser.updatePassword(newPassword);
        }, err => reject(err));
    }
    ));
  }

  forgotPassword(email) {
    return from(new Promise<any>((resolve, reject) => {
      firebase.default.auth().sendPasswordResetEmail(email).then(
        (res) => {
          resolve(res);
        }, err => reject(err));
    }
    ));
  }

  verifyPasswordResetCode(code) {
    return from(new Promise<any>((resolve, reject) => {
      firebase.default.auth().verifyPasswordResetCode(code).then(
        (res) => {
          resolve(res);
        }, err => reject(err));
    }
    ));
  }

  confirmPasswordReset(code, newPassword) {
    return from(new Promise<any>((resolve, reject) => {
      firebase.default.auth().confirmPasswordReset(code, newPassword).then(
        (res) => {
          resolve(res);
        }, err => reject(err));
    }
    ));
  }

  updateEmail(newEmail) {
    return from(new Promise<any>((resolve, reject) => {
      firebase.default.auth().currentUser.updateEmail(newEmail).then(
        res => {
          resolve(res);
        }, err => reject(err));
    }
    ));
  }
}
