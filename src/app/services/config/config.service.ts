import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as SettingsActions from 'src/app/services/store/settings/settings.action';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {

  constructor(private store: Store<{}>) {
  }

  init() {
    this.store.dispatch(SettingsActions.BeginLoadingAction());
    this.store.dispatch(SettingsActions.BeginLoadSettingsAction());
    this.store.dispatch(SettingsActions.BeginGetActiveCategoriesAction());
    this.store.dispatch(SettingsActions.BeginGetAllPagesAction());
    this.store.dispatch(SettingsActions.BeginSetResolutionAction());
  }
}
