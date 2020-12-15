import { UserPerosnalInfo, UserAddressInfo, FavoriteItem, OrderItem, UserPermissions } from './user.model';

export default class UserState {
  uid: any;
  personalInfo? : UserPerosnalInfo;
  addressInfo? : UserAddressInfo;
  site? : any;
  permissions?: UserPermissions;
  favorites? : Array<FavoriteItem>;
  orders? : Array<OrderItem>;
  UserError: Error;
}

export const initializeState = (): UserState => {
  return { uid: '', UserError: null };
};
