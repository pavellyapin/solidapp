import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'doo-fulfill-order-modal',
    templateUrl: './confirm-fulfill.component.html',
    styleUrls: ['./confirm-fulfill.component.scss']
  })
  export class ConfirmFullfillOrderModalComponent {
  
    constructor(
      public dialogRef: MatDialogRef<ConfirmFullfillOrderModalComponent>,
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