import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'doo-undeliver-order-modal',
    templateUrl: './confirm-undeliver.component.html',
    styleUrls: ['./confirm-undeliver.component.scss']
  })
  export class ConfirmUndeliverOrderModalComponent {
  
    constructor(
      public dialogRef: MatDialogRef<ConfirmUndeliverOrderModalComponent>,
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