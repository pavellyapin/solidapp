import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable()
export class CartService {
    private shippingChangeSource = new Subject<any>();
    shippingChangeEmitted$ = this.shippingChangeSource.asObservable();
    
    private paymentChangeSource = new Subject<any>();
    paymentChangeEmitted$ = this.paymentChangeSource.asObservable();

    emitShippingChange(change: any) {
        this.shippingChangeSource.next(change);
    }

    emitPaymentChange(change: any) {
        this.paymentChangeSource.next(change);
    }
}