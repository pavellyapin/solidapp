import { CartItem } from './cart.model';
import { UserAddressInfo } from '../user/user.model';


export default class CartState {
  items: Array<CartItem>;
  cartId?: string;
  shipping? : UserAddressInfo;
  CartError: Error;
}

export const initializeState = (): CartState => {
  return {items : [], CartError: null };
};
