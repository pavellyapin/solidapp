import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import CartState from 'src/app/services/store/cart/cart.state';
import * as CartActions from '../../../services/store/cart/cart.action';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class CheckoutSuccessGuard implements CanActivate  {

  cartId$: Observable<string>;
  cartId: string;
  
  constructor(public afAuth: AngularFireAuth,private store: Store<{}>) {
      
  }


  canActivate(route: ActivatedRouteSnapshot) : Observable<boolean> | boolean {
    this.store.dispatch(CartActions.BeginResetCartAction());
      return this.afAuth.authState.pipe(map((auth)=> {
        return true
      }));
  }
}
