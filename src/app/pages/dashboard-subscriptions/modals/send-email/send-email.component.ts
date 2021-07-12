import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'doo-send-email-modal',
    templateUrl: './send-email.component.html',
    styleUrls: ['./send-email.component.scss']
  })
  export class SendEmailModalComponent {

    templateId:any;
  
    constructor(
      public dialogRef: MatDialogRef<SendEmailModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
  
    }
  
    ngOnInit() {
      //console.log('data' , this.data);
      this.templateId = this.data.permissions.emailTemplates[0];
  
    }

  
    ngOnDestroy() {
  
    }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }