import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import SettingsState from '../store/settings/settings.state';
import * as SettingsActions from 'src/app/services/store/settings/settings.action';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {

  constructor(private store: Store<{ settings: SettingsState }>) {
  }

  init() {
    this.store.dispatch(SettingsActions.BeginLoadSettingsAction());
    this.store.dispatch(SettingsActions.BeginGetActiveCategoriesAction());
    this.store.dispatch(SettingsActions.BeginSetResolutionAction());
  }
}
