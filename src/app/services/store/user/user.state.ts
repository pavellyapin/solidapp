import { UserPerosnalInfo, UserAddressInfo, FavoriteItem, OrderItem } from './user.model';

export default class UserState {
  uid: any;
  personalInfo? : UserPerosnalInfo;
  addressInfo? : UserAddressInfo;
  site? : any;
  favorites? : Array<FavoriteItem>;
  orders? : Array<OrderItem>;
  UserError: Error;
}

export const initializeState = (): UserState => {
  return { uid: '', UserError: null };
};
