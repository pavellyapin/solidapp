import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'doo-confirm-delete-customer',
    templateUrl: './confirm-delete.component.html',
    styleUrls: ['./confirm-delete.component.scss']
  })
  export class ConfirmDeleteCustomerModalComponent {
  
    constructor(
      public dialogRef: MatDialogRef<ConfirmDeleteCustomerModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
  
    }
  
    ngOnInit() {
      console.log('data' , this.data);
  
    }

  
    ngOnDestroy() {
  
    }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }