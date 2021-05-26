import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'doo-review-cart-modal',
    templateUrl: './confirm-review.component.html',
    styleUrls: ['./confirm-review.component.scss']
  })
  export class ConfirmReviewCartModalComponent {
  
    constructor(
      public dialogRef: MatDialogRef<ConfirmReviewCartModalComponent>,
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