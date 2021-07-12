import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Entry } from 'contentful';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { UtilitiesService } from 'src/app/services/util/util.service';
import { FirestoreUserService } from 'src/app/services/firestore/sub-services/firestore-user.service';
import { map } from 'rxjs/operators';

@Component({
    selector: 'doo-subscribe',
    templateUrl: './subscribe.component.html',
    styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {

    @Input() widget: Entry<any>;
    subscribeForm: FormGroup;
    isSubscribed:boolean = false;

    constructor(private navService: NavigationService,
        private utils: UtilitiesService,
        private firestore: FirestoreUserService) {
        this.subscribeForm = new FormGroup({
            email: new FormControl('', Validators.required)
        });
    }
    ngOnInit(): void {
        //throw new Error("Method not implemented.");
    }

    subscribeEmail() {
        if (this.subscribeForm.valid) {
            this.utils.scrollTop();
            this.navService.startLoading();
            this.firestore.emailSubscribe(this.subscribeForm.value).pipe(map((x) => {
                if (this.widget.fields.action) {
                    this.navService.ctaClick(this.widget.fields.action.fields.action);
                } else {
                    this.isSubscribed = true;
                }
            })).subscribe();

        } else {
            this.subscribeForm.markAllAsTouched();
        }
    }
}