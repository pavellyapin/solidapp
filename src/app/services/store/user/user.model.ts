export default class User { 
  uid?:any;
  personalInfo:UserPerosnalInfo;
  addressInfo?:UserAddressInfo;
  favorites? : Array<FavoriteItem>;
}

export class UserPerosnalInfo { 
  firstName : string;
  lastName: string;
  phone : string;
  email: string;
}

export class UserAddressInfo { 
  addressLine1 : string;
  addressLine2: string;
  city : string;
  province: string;
  postal: string;
}

export class FavoriteItem {
  product : {
    productId : string
  };
  docId : string;
}
