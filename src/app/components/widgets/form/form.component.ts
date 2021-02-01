import { Component, OnInit, Input, ViewChildren, QueryList, ElementRef } from "@angular/core";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as UserActions from 'src/app/services/store/user/user.action';
import { Entry } from 'contentful';
import { MatInput, MatTextareaAutosize } from '@angular/material/input';
import { MyErrorStateMatcher } from '../../pipes/pipes';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { map } from 'rxjs/operators';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { UtilitiesService } from 'src/app/services/util/util.service';

@Component({
    selector: 'doo-form-widget',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss']
})
export class FormWidgetComponent implements OnInit {

    @Input() widget: Entry<any>;
    formWidget: FormGroup;
    matcher = new MyErrorStateMatcher();

    constructor(private store: Store<{}>,
                private el: ElementRef,
                private navService: NavigationService,
                private utils : UtilitiesService,
                private firestore : FirestoreService) {
        this.formWidget = new FormGroup({
            firstName: new FormControl('', Validators.required),
            lastName: new FormControl(''),
            email: new FormControl('', Validators.required),
            phone: new FormControl('+1', Validators.required),
            address : new FormControl('', Validators.required),
        });
    }
    ngOnInit(): void {

        for (let question of this.widget.fields.blocks) {
            if (question.fields.question) {
                this.formWidget.addControl(question.fields.name,
                    new FormControl(question.fields.type == 'multiple choice' ? question.fields.choices[0] : '' , question.fields.required ? Validators.required : null));
            }
        }
    }

    submitForm() {
        if (this.formWidget.valid) {
            this.utils.scrollTop();
            this.navService.startLoading();
            this.firestore.saveClientForm(this.formWidget.value).pipe(map((x)=>{
                this.navService.ctaClick(this.widget.fields.action.fields.action);
            })).subscribe();;

        } else {
            this.formWidget.markAllAsTouched();
            this.scrollToFirstInvalidControl();
        }

    }

    private scrollToFirstInvalidControl() {
        const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
          ".doo-form-widget .ng-invalid"
        );

        window.scroll({
            top: this.getTopOffset(firstInvalidControl),
            left: 0,
            behavior: "smooth"
          });
      }

      private getTopOffset(controlEl: HTMLElement): number {
        const labelOffset = 250;
        return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
      }



    ngAfterViewInit() {

    }
} 