import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'doo-unfulfill-order-modal',
    templateUrl: './confirm-unfulfill.component.html',
    styleUrls: ['./confirm-unfulfill.component.scss']
  })
  export class ConfirmUnFullfillOrderModalComponent {
  
    constructor(
      public dialogRef: MatDialogRef<ConfirmUnFullfillOrderModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
  
    }
  
    ngOnInit() {
      //console.log('data' , this.data);
  
    }

  
    ngOnDestroy() {
  
    }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }