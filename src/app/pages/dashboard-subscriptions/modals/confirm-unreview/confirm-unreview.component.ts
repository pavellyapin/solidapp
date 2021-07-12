import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'doo-unreview-subscription-modal',
    templateUrl: './confirm-unreview.component.html',
    styleUrls: ['./confirm-unreview.component.scss']
  })
  export class ConfirmUnReviewSubscriptionModalComponent {
  
    constructor(
      public dialogRef: MatDialogRef<ConfirmUnReviewSubscriptionModalComponent>,
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