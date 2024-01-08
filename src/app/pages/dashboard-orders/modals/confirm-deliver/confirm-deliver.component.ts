import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'doo-deliver-order-modal',
    templateUrl: './confirm-deliver.component.html',
    styleUrls: ['./confirm-deliver.component.scss']
  })
  export class ConfirmDeliverOrderModalComponent {
  
    constructor(
      public dialogRef: MatDialogRef<ConfirmDeliverOrderModalComponent>,
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