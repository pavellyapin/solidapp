import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { ScriptService } from 'src/app/services/util/script.service';

@Injectable({
  providedIn: 'root',
})
export class CheckoutPaymentGuard implements CanActivate {

  constructor(
    public scriptService: ScriptService) {
  }

  canActivate(): Promise<any> {
    return this.scriptService.loadScript('stripe').then(data => {
      return this.scriptService.loadScript('stripeElements').then(data => {
        return true;
      });
     }).catch(error => console.log(error));
  }
}
