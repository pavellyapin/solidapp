import { Entry } from 'contentful';

export default class SettingsState {
  siteConfig?: Entry<any>;
  categories? : Entry<any>[];
  SettingsError: Error;
}

export const initializeState = (): SettingsState => {
  return { SettingsError: null };
};
