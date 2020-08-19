import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import UserState from 'src/app/services/store/user/user.state';
import * as UserActions from 'src/app/services/store/user/user.action';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { UserPerosnalInfo } from 'src/app/services/store/user/user.model';
import { NavigationService } from 'src/app/services/navigation/navigation.service';

@Component({
  selector: 'profile-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit , OnDestroy {

  user$: Observable<UserPerosnalInfo>;
  UserSubscription: Subscription;
  userInfo: UserPerosnalInfo;
  personalInfo: FormGroup;
  contactInfo: FormGroup;
  passwordInfo: FormGroup;
  editMode:boolean;
  contactEditMode:boolean;
  passwordEditMode:boolean;
  
  constructor(private store: Store<{ user: UserState }>,
              private navService: NavigationService,
              private cd: ChangeDetectorRef) {
                this.user$ = store.pipe(select('user','personalInfo'));

              this.personalInfo = new FormGroup({        
                  firstName: new FormControl(''),
                  lastName: new FormControl(''),
              });

              this.contactInfo = new FormGroup({        
                  phone: new FormControl(''),
                  email: new FormControl('')
              });

              this.passwordInfo = new FormGroup({        
                  oldPassword: new FormControl(''),
                  newPassword: new FormControl('')
              });
  }

  ngOnInit() {
    this.UserSubscription = this.user$
      .pipe(
        map(x => {
          this.userInfo = x;
        })
      )
      .subscribe();
  }

  toggleEditForm(type) {
    if (type == 'personal') {
      if (this.editMode) {
        this.editMode = false;
      } else {
        this.personalInfo.controls["firstName"].setValue(this.userInfo.firstName);
        this.personalInfo.controls["lastName"].setValue(this.userInfo.lastName);
        this.editMode = true;
        this.cd.detectChanges();
      }
    } else if(type == 'contact') {
      if (this.contactEditMode) {
        this.contactEditMode = false;
      } else {
        this.contactInfo.controls["phone"].setValue(this.userInfo.phone);
        this.contactInfo.controls["email"].setValue(this.userInfo.email);
        this.contactEditMode = true;
        this.cd.detectChanges();
      }
    }
  }

  savePersonalInfo() {
    this.navService.startLoading();
    this.store.dispatch(UserActions.BeginUpdatePerosnalInfoUserAction({ payload: this.personalInfo }));
  }

  updatePassword() {
    this.store.dispatch(UserActions.BeginUpdatePasswordAction({ payload: this.passwordInfo }));
    this.passwordEditMode = false;
  }

  updateContactInfo() {
    this.navService.startLoading();
    if (this.contactInfo.controls["email"].value == this.userInfo.email) {
      this.store.dispatch(UserActions.BeginUpdateUserContactInfoAction({ payload: this.contactInfo }));
    } else {
        this.store.dispatch(UserActions.BeginUpdateUserEmailAction({ payload: this.contactInfo }));
    }
  }

  ngOnDestroy(): void {
    this.UserSubscription.unsubscribe();
  }
}
