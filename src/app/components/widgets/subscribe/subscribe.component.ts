import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as UserActions from 'src/app/services/store/user/user.action';
import { Entry } from 'contentful';

@Component({
    selector: 'doo-subscribe',
    templateUrl: './subscribe.component.html',
    styleUrls: ['./subscribe.component.scss']
  })
  export class SubscribeComponent implements OnInit {

    @Input() widget : Entry<any>;
    subscribeForm: FormGroup;

    constructor(private store: Store<{ }>) {
        this.subscribeForm = new FormGroup({        
            email: new FormControl('')
        });
    }
    ngOnInit(): void {
        //throw new Error("Method not implemented.");
    }

    subscribeEmail() {
        this.store.dispatch(UserActions.BeginSubscribeEmailAction({ payload: this.subscribeForm }));
      }
  }