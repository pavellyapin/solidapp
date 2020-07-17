import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SelectValue, MyErrorStateMatcher } from 'src/app/components/pipes/pipes';
import { Observable } from 'rxjs';
import { UserAddressInfo, UserPerosnalInfo } from 'src/app/services/store/user/user.model';
import { UtilitiesService } from 'src/app/services/util/util.service';
import { MatSelect } from '@angular/material/select';
import { NameFormComponent } from '../../login/name-form/name-form.component';

@Component({
    selector: 'doo-address-form',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.scss']
  })
  export class AddressFormComponent implements OnInit , OnDestroy {

    @Input() userAddressInfo:UserAddressInfo;
    @Input() userInfo: UserPerosnalInfo;
    @Input() isWithName : boolean;
    @Output() addressFormEmitter = new EventEmitter<any>();
    @Output() personalFormEmitter = new EventEmitter<any>();

    scriptLoaded : boolean = false;
    timerId : any;
    address$: Observable<UserAddressInfo>;
    addMode:boolean = true;
    addManually:boolean = false;
    addAddressLine2:boolean = false;
    address: any;
    addressComponents: any;
    addressForm : FormGroup;
    matcher = new MyErrorStateMatcher();
    googleMapsURL : any = "https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyAlKy-UhEx80WkZjrzDkhmd0nftq42X3Gg";

    @ViewChild('search',{static: false}) search: ElementRef;
    @ViewChild('addressLine1',{static: false}) addressLine1: ElementRef;
    @ViewChild('addressLine2',{static: false}) addressLine2: ElementRef;
    @ViewChild('province',{static: false}) province: MatSelect;
    @ViewChild('city',{static: false}) city: ElementRef;
    @ViewChild('postal',{static: false}) postal: ElementRef;

    @ViewChild('nameForm',{static: false}) 
    public nameFormComponent: NameFormComponent;


    constructor (private changeDetectorRef: ChangeDetectorRef,
                 private utilService: UtilitiesService) {

        this.addressForm = new FormGroup({        
            addressLine1: new FormControl('' , Validators.required),
            addressLine2: new FormControl(''),
            city: new FormControl('' , Validators.required),
            province: new FormControl('' , Validators.required),
            postal: new FormControl('' , Validators.required)
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
        if (this.userAddressInfo) {
            this.addressForm.controls["addressLine1"].setValue(this.userAddressInfo.addressLine1);
            this.addressForm.controls["addressLine2"].setValue(this.userAddressInfo.addressLine2);
            this.addressForm.controls["city"].setValue(this.userAddressInfo.city);
            this.addressForm.controls["province"].setValue(this.userAddressInfo.province);
            this.addressForm.controls["postal"].setValue(this.userAddressInfo.postal);
        }


        this.changeDetectorRef.detectChanges();
    } 

    resetForm() {
        this.addressForm = new FormGroup({        
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
        this.timerId = setTimeout(() => { 
        
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
                    this.addressForm.controls["province"].setValue(component.short_name);
                    continue;
                }
                if (component.types.indexOf("postal_code") != -1) {
                    this.postal.nativeElement.focus();
                    this.addressForm.controls["postal"].setValue(component.short_name);
                    continue;
                }
                if (component.types.indexOf("locality") != -1) {
                    this.city.nativeElement.focus();
                    this.addressForm.controls["city"].setValue(component.short_name);
                    continue;
                }
            }
            this.addressLine1.nativeElement.focus();
            if (streetNumber && streetName) {
                this.addressForm.controls["addressLine1"].setValue(streetNumber + ' ' + streetName);
            } 
            this.addressLine2.nativeElement.focus();
            this.changeDetectorRef.detectChanges();
        clearTimeout(this.timerId);} , 100);
      }

      ngOnChanges() {
          
      }

      saveAddress() {
          if (this.isWithName) {
            if (this.nameFormComponent.userForm.valid) {
                this.savePersonalInfo();
              } else {
                  this.nameFormComponent.userForm.markAllAsTouched();
                  return;
              }
            
          }
          if (this.addressForm.valid) {
            this.addressFormEmitter.emit(this.addressForm.value);
            this.userAddressInfo = new UserAddressInfo;
            this.userAddressInfo.addressLine1 = this.addressForm.controls["addressLine1"].value;
            this.userAddressInfo.addressLine2 = this.addressForm.controls["addressLine2"].value;
            this.userAddressInfo.city = this.addressForm.controls["city"].value;
            this.userAddressInfo.province = this.addressForm.controls["province"].value;
            this.userAddressInfo.postal = this.addressForm.controls["postal"].value;
            this.changeDetectorRef.detectChanges();
          } else {
            this.addManually = true;
            this.timerId = setTimeout(() => {this.addressForm.markAllAsTouched();
            },100)
          }
      }

      savePersonalInfo() {
          this.userInfo = new UserPerosnalInfo;
          this.userInfo.firstName = this.nameFormComponent.userForm.controls["firstName"].value;
          this.userInfo.lastName = this.nameFormComponent.userForm.controls["lastName"].value;
          this.personalFormEmitter.emit(this.userInfo);
      }

      provinces: SelectValue[] = [
        {value: 'ON', viewValue: 'Ontario'},
        {value: 'QC', viewValue: 'Quebec'}
      ]; 

          
     ngOnDestroy(): void {
        
    }

  }