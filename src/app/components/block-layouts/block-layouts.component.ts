import { Component, OnInit, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { map } from 'rxjs/operators';

@Component({
  selector: 'doo-block-layouts',
  templateUrl: './block-layouts.component.html',
})
export class BlockLayoutComponent implements OnInit {

  @Input() block;
  resolution$: Observable<string>;
  resolution : any;
  SettingsSubscription : Subscription;

  constructor(store: Store<{ settings: SettingsState }>) {
    this.resolution$ = store.pipe(select('settings' , 'resolution'));
  }

  ngOnInit() {
      //console.log('block' , this.block);
      this.SettingsSubscription = this.resolution$
      .pipe(
        map(x => {
          this.resolution = x;
        })
      )
      .subscribe();
  }

  ngOnDestroy(){
    this.SettingsSubscription.unsubscribe();
  }

}
