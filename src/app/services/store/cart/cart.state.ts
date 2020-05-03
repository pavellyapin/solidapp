import { CartItem } from './cart.model';
import { UserAddressInfo } from '../user/user.model';


export default class CartState {
  cartId?: string;
  items: Array<CartItem>;
  total? : any;
  shipping? : UserAddressInfo;
  CartError: Error;
}

export const initializeState = (): CartState => {
  return {items : [], CartError: null };
};
