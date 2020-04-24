import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { from } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  uid:any;
  idToken:any;
  authReady:boolean;

  constructor(public afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(
      (auth) => {
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
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(
        function() {
          firebase.auth().signInWithEmailAndPassword(email, password)
          .then(res => {
            resolve(res);
          }, err => reject(err));
        }
      )
    }));
  }

  doLogout() {
    return from(new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.auth.signOut();
        resolve();
      } else {
        reject();
      }
    }));
  }

  doRegister(email,password) {
    return from( new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(res => {
        resolve(res);
      }, err => reject(err));
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

  updateEmail(newEmail) {
    return from( new Promise<any>((resolve, reject) => {
      firebase.auth().currentUser.updateEmail(newEmail).then(
        res => {
          resolve(res);
          }, err => reject(err));
        }
      ));
  }

  public isLoggedIn(): boolean {
    return true;
  }
}
