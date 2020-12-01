import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserPerosnalInfo } from 'src/app/services/store/user/user.model';

@Component({
  selector: 'doo-name-form',
  templateUrl: './name-form.component.html',
  styleUrls: ['./name-form.component.scss']
})
export class NameFormComponent implements OnInit , OnDestroy {

  @Input()  userInfo: UserPerosnalInfo;
  @Input() showSaveButton:boolean;
  @Output() personalFormEmitter = new EventEmitter<any>();

  editMode:boolean = true;
  userForm: FormGroup;
  
  constructor() {
    this.userForm = new FormGroup({        
      firstName : new FormControl('' , Validators.required),
      lastName : new FormControl('' , Validators.required),
      email : new FormControl('' , Validators.required),
      phone : new FormControl('' , null)
  })
  }

  ngOnInit() {
    if (this.userInfo) {
      this.userForm.controls["firstName"].setValue(this.userInfo.firstName);
      this.userForm.controls["lastName"].setValue(this.userInfo.lastName);
      this.userForm.controls["email"].setValue(this.userInfo.email);
      this.userForm.controls["phone"].setValue(this.userInfo.phone);
    }
  }

  savePersonalInfo() {
    if (this.userForm.valid) {
      this.userInfo = new UserPerosnalInfo;
      this.userInfo.firstName = this.userForm.controls["firstName"].value;
      this.userInfo.lastName = this.userForm.controls["lastName"].value;
      this.userInfo.email = this.userForm.controls["email"].value;
      this.userInfo.email = this.userForm.controls["phone"].value;
      this.personalFormEmitter.emit(this.userInfo);
    }
  }

  ngOnDestroy(): void {
  }
}
