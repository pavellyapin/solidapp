import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SelectValue } from 'src/app/components/pipes/pipes';
import { Actions, ofType } from '@ngrx/effects';
import * as UserActions from 'src/app/services/store/user/user.action';
import { Observable, Subscription } from 'rxjs';
import { UserAddressInfo } from 'src/app/services/store/user/user.model';
import { UtilitiesService } from 'src/app/services/util/util.service';

@Component({
    selector: 'doo-address-form',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.scss']
  })
  export class AddressFormComponent implements OnInit , OnDestroy {

    @Input() mode:string;
    @Input() userAddressInfo:UserAddressInfo;
    @Output() addressFormEmitter = new EventEmitter<FormGroup>();

    scriptLoaded : boolean = false;
    address$: Observable<UserAddressInfo>;
    addMode:boolean = false;
    addManually:boolean = false;
    addAddressLine2:boolean = false;
    address: any;
    addressComponents: any;
    addressInfo : FormGroup;
    actionSubscription: Subscription;
    googleMapsURL : any = "https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyAlKy-UhEx80WkZjrzDkhmd0nftq42X3Gg";

    @ViewChild('search',{static: false}) search: ElementRef;
    @ViewChild('addressLine1',{static: false}) addressLine1: ElementRef;
    @ViewChild('addressLine2',{static: false}) addressLine2: ElementRef;
    @ViewChild('city',{static: false}) city: ElementRef;
    @ViewChild('postal',{static: false}) postal: ElementRef;


    constructor (private _actions$: Actions,
                 private changeDetectorRef: ChangeDetectorRef,
                 private utilService: UtilitiesService) {

        this.addressInfo = new FormGroup({        
            addressLine1: new FormControl('' , Validators.required),
            addressLine2: new FormControl(''),
            city: new FormControl('' , Validators.required),
            province: new FormControl('' , Validators.required),
            postal: new FormControl('' , Validators.required),
            shipping : new FormControl('' , Validators.required)
        })
    }

    ngOnInit(): void {

        this.utilService.isScriptLoaded(this.googleMapsURL).then((loaded) =>{
            if (!loaded) {
                this.utilService.loadScript(this.googleMapsURL).then(()=>{
                    this.scriptLoaded = true;
                });
            } else {
                this.scriptLoaded = true;
            }
        });

        if (!this.userAddressInfo.addressLine1) {
            this.addMode = true;
        }

        this.addressInfo.controls["addressLine1"].setValue(this.userAddressInfo.addressLine1);
        this.addressInfo.controls["addressLine2"].setValue(this.userAddressInfo.addressLine2);
        this.addressInfo.controls["city"].setValue(this.userAddressInfo.city);
        this.addressInfo.controls["province"].setValue(this.userAddressInfo.province);
        this.addressInfo.controls["postal"].setValue(this.userAddressInfo.postal);
 
        this.actionSubscription = this._actions$.pipe(ofType(UserActions.SuccessGetUserAddressInfoAction)).subscribe(() => {
        this.addMode = this.addManually = false;    
        });

        this.changeDetectorRef.detectChanges();
    } 

    resetForm() {
        this.addressInfo = new FormGroup({        
            addressLine1: new FormControl('' , Validators.required),
            addressLine2: new FormControl(''),
            city: new FormControl('' , Validators.required),
            province: new FormControl('' , Validators.required),
            postal: new FormControl('' , Validators.required)
        });
    }

    getAddress(place: any) {  
        this.resetForm();
        this.addManually = true;
        this.changeDetectorRef.detectChanges();
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
                this.postal.nativeElement.focus();
                this.addressInfo.controls["postal"].setValue(component.short_name);
                continue;
            }
            if (component.types.indexOf("locality") != -1) {
                this.city.nativeElement.focus();
                this.addressInfo.controls["city"].setValue(component.short_name);
                continue;
            }
        }
        this.addressLine1.nativeElement.focus();
        if (streetNumber && streetName) {
            this.addressInfo.controls["addressLine1"].setValue(streetNumber + ' ' + streetName);
        } 
        this.addressLine2.nativeElement.focus();
        
      }

      ngOnChanges() {
          
      }

      saveAddress() {
        this.addressFormEmitter.emit(this.addressInfo);
        this.addMode = this.addManually = false;
        this.changeDetectorRef.detectChanges();
        //this.store.dispatch(UserActions.BeginUpdateUserAddressInfoAction({ payload: this.addressInfo }));
      }

      provinces: SelectValue[] = [
        {value: 'ON', viewValue: 'Ontario'},
        {value: 'QC', viewValue: 'Quebec'}
      ]; 

          
     ngOnDestroy(): void {
        
    }

  }