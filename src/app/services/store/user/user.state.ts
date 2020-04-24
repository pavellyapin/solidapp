import { UserPerosnalInfo, UserAddressInfo, FavoriteItem } from './user.model';

export default class UserState {
  uid: any;
  personalInfo? : UserPerosnalInfo;
  addressInfo? : UserAddressInfo;
  favorites? : Array<FavoriteItem>;
  UserError: Error;
}

export const initializeState = (): UserState => {
  return { uid: '', UserError: null };
};
