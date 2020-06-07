import { Entry } from 'contentful';

export default class SettingsState {
  siteConfig?: Entry<any>;
  categories? : Entry<any>[];
  pages? : Entry<any>[];
  resolution? : string ;
  loading? : boolean;
  SettingsError: Error;
}

export const initializeState = (): SettingsState => {
  return { SettingsError: null };
};
