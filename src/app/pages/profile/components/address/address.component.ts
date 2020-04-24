import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SelectValue } from 'src/app/components/pipes/pipes';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import * as UserActions from 'src/app/services/store/user/user.action';
import UserState from 'src/app/services/store/user/user.state';
import { Observable, Subscription } from 'rxjs';
import { UserAddressInfo } from 'src/app/services/store/user/user.model';
import { map } from 'rxjs/operators';

@Component({
    selector: 'profile-address',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.scss']
  })
  export class AddressComponent implements OnInit , OnDestroy {

    address$: Observable<UserAddressInfo>;
    addMode:boolean = false;
    addManually:boolean = false;
    addAddressLine2:boolean = false;
    address: any;
    addressComponents: any;
    addressInfo: FormGroup;
    UserSubscription: Subscription;
    actionSubscription: Subscription;
    userAddressInfo: UserAddressInfo;

    constructor (private store: Store<{ user: UserState }>,
                 private _actions$: Actions) {

        this.address$ = store.pipe(select('user' , 'addressInfo'));

        this.addressInfo = new FormGroup({        
            addressLine1: new FormControl(''),
            addressLine2: new FormControl(''),
            city: new FormControl(''),
            province: new FormControl(''),
            postal: new FormControl('')
        })
    }

    ngOnInit(): void {
        this.loadScript();

        this.UserSubscription = this.address$
        .pipe(
          map(x => {
            this.userAddressInfo = x;
            if (this.userAddressInfo) {
                this.addressInfo.controls["addressLine1"].setValue(this.userAddressInfo.addressLine1);
                this.addressInfo.controls["addressLine2"].setValue(this.userAddressInfo.addressLine2);
                this.addressInfo.controls["city"].setValue(this.userAddressInfo.city);
                this.addressInfo.controls["province"].setValue(this.userAddressInfo.province);
                this.addressInfo.controls["postal"].setValue(this.userAddressInfo.postal);
            }

          })
        )
        .subscribe();
        this.actionSubscription = this._actions$.pipe(ofType(UserActions.SuccessGetUserAddressInfoAction)).subscribe(() => {
        this.addMode = this.addManually = false;    
        });
    } 
    
    loadScript() {
        var scripts = document.getElementsByTagName('script');
            for (var i = scripts.length; i--;) {
                if (scripts[i].src == "https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyAlKy-UhEx80WkZjrzDkhmd0nftq42X3Gg") return;
            }
        let node = document.createElement('script');
        node.src = "https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyAlKy-UhEx80WkZjrzDkhmd0nftq42X3Gg";
        node.type = 'text/javascript';
        node.async = true;
        node.charset = 'utf-8';
        document.getElementsByTagName('head')[0].appendChild(node);
    }


    getAddress(place: any) {    
        this.address = place;
        this.addressComponents = place['address_components'];

        let streetNumber;
        let streetName;

        for (var component of this.addressComponents) {
            if (component.types.indexOf("street_number") != -1) {
                streetNumber = component.short_name;
                continue;
            }
            if (component.types.indexOf("route") != -1) {
                streetName = component.short_name;
                continue;
            }
            if (component.types.indexOf("administrative_area_level_1") != -1) {
                this.addressInfo.controls["province"].setValue(component.short_name);
                continue;
            }
            if (component.types.indexOf("postal_code") != -1) {
                this.addressInfo.controls["postal"].setValue(component.short_name);
                continue;
            }
            if (component.types.indexOf("locality") != -1) {
                this.addressInfo.controls["city"].setValue(component.short_name);
                continue;
            }
        }
        this.addressInfo.controls["addressLine1"].setValue(streetNumber + ' ' + streetName);
      }

      saveAddress() {
        this.store.dispatch(UserActions.BeginUpdateUserAddressInfoAction({ payload: this.addressInfo }));
      }

      provinces: SelectValue[] = [
        {value: 'ON', viewValue: 'Ontario'}
      ]; 

          
     ngOnDestroy(): void {
        this.UserSubscription.unsubscribe();
    }

  }