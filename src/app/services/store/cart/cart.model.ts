import { UserAddressInfo } from '../user/user.model';

export default class Cart {
  items?: Array<CartItem>;
  cartid? : any;
  shipping? : UserAddressInfo;
}

export class CartItem {
    productId:string;
    variants?: any;
    variantPrice : any;
    qty?: number;
    price : number;
}