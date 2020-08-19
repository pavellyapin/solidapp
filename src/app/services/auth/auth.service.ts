import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { from } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import User, { UserPerosnalInfo } from '../store/user/user.model';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  uid:any;
  idToken:any;
  authReady$ = new BehaviorSubject<boolean>(false);

  constructor(public afAuth: AngularFireAuth, private firestore: AngularFirestore ,) {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    this.afAuth.authState.subscribe(
      (auth) => {
          this.authReady$.next(true);
          if (auth != null) {
              this.uid = auth.uid;
              this.idToken = auth.getIdToken();
          } else {
              this.uid = null;
          }
        });
  }

  doLogin(email,password): Observable<any> {
    return from(new Promise<any>((resolve, reject) => {
          firebase.auth().signInWithEmailAndPassword(email, password)
          .then(res => {
            resolve(res);
          }, err => reject(err));
    }));
  }

  
  doLoginWithGoogle() {
    return from( new Promise<any>((resolve, reject) => {
      if(this.uid) {
        firebase.auth().signOut().then(()=>{
          firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
          .then(res => {
            if (res.additionalUserInfo.isNewUser) {
                 this.firestore
                    .collection("customers")
                    .doc("customers")
                    .collection(res.user.uid)
                    .doc("personalInfo")
                    .set({email : res.additionalUserInfo.profile["email"],
                          firstName : res.additionalUserInfo.profile["given_name"],
                          lastName : res.additionalUserInfo.profile["family_name"],
                          phone : '',
                          provider : 'google'})
            
            }
            resolve(res);
          }, err => reject(err));
        });
      } else {
        firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(res => {
          if (res.additionalUserInfo.isNewUser) {
               this.firestore
                  .collection("customers")
                  .doc("customers")
                  .collection(res.user.uid)
                  .doc("personalInfo")
                  .set({email : res.additionalUserInfo.profile["email"],
                        firstName : res.additionalUserInfo.profile["given_name"],
                        lastName : res.additionalUserInfo.profile["family_name"],
                        phone : '',
                        provider : 'google'})
          
          }
          resolve(res);
        }, err => reject(err));
      }
    }));
  }

  doLoginWithFacebook() {
    return from( new Promise<any>((resolve, reject) => {
      if(this.uid) {
        firebase.auth().signOut().then(()=>{
          firebase.auth().signInWithPopup(new firebase.auth.FacebookAuthProvider())
          .then(res => {
            if (res.additionalUserInfo.isNewUser) {
                 this.firestore
                    .collection("customers")
                    .doc("customers")
                    .collection(res.user.uid)
                    .doc("personalInfo")
                    .set({email : res.additionalUserInfo.profile["email"],
                          firstName : res.additionalUserInfo.profile["first_name"],
                          lastName : res.additionalUserInfo.profile["last_name"],
                          phone : '',
                          provider : 'facebook'})
            
            }
            resolve(res);
          }, err => reject(err));
        });
      } else {
        firebase.auth().signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => {
          if (res.additionalUserInfo.isNewUser) {
               this.firestore
                  .collection("customers")
                  .doc("customers")
                  .collection(res.user.uid)
                  .doc("personalInfo")
                  .set({email : res.additionalUserInfo.profile["email"],
                        firstName : res.additionalUserInfo.profile["first_name"],
                        lastName : res.additionalUserInfo.profile["last_name"],
                        phone : '',
                        provider : 'facebook'})
          
          }
          resolve(res);
        }, err => reject(err));
      }
    }));
  }

  doLogout() {
    return from(new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.auth.signOut();
        this.uid = null;
        this.idToken = null;
        resolve();
      } else {
        reject();
      }
    }));
  }

  doRegister(email,password) {
    return from( new Promise<any>((resolve, reject) => {
      if(this.uid) {
        firebase.auth().signOut().then(()=>{
          firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(res => {
                 this.firestore
                    .collection("customers")
                    .doc("customers")
                    .collection(res.user.uid)
                    .doc("personalInfo")
                    .set({email : email,
                          firstName : '',
                          lastName : '',
                          phone : '',
                          provider : 'email'})
            
            resolve(res);
          }, err => reject(err));
        });
      } else {
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(res => {
                 this.firestore
                    .collection("customers")
                    .doc("customers")
                    .collection(res.user.uid)
                    .doc("personalInfo")
                    .set({email : email,
                          firstName : '',
                          lastName : '',
                          phone : '',
                          provider : 'email'})
          resolve(res);
        }, err => reject(err));
      }
    }));
  }


  updatePassword(password , newPassword) {
    let credentials = firebase.auth.EmailAuthProvider.credential(
      firebase.auth().currentUser.email, password);

    return from( new Promise<any>((resolve, reject) => {
      firebase.auth().currentUser.reauthenticateWithCredential(credentials).then(
        () => {
          firebase.auth().currentUser.updatePassword(newPassword);
          }, err => reject(err));
        }
      ));
  }

  forgotPassword(email) {
    return from( new Promise<any>((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(email).then(
        (res) => {
          resolve(res);
          }, err => reject(err));
        }
      ));
  }

  verifyPasswordResetCode(code) {
    return from( new Promise<any>((resolve, reject) => {
      firebase.auth().verifyPasswordResetCode(code).then(
        (res) => {
          resolve(res);
          }, err => reject(err));
        }
      ));
  }

  confirmPasswordReset(code,newPassword) {
    return from( new Promise<any>((resolve, reject) => {
      firebase.auth().confirmPasswordReset(code,newPassword).then(
        (res) => {
          resolve(res);
          }, err => reject(err));
        }
      ));
  }

  updateEmail(newEmail) {
    return from( new Promise<any>((resolve, reject) => {
      firebase.auth().currentUser.updateEmail(newEmail).then(
        res => {
          resolve(res);
          }, err => reject(err));
        }
      ));
  }
}
