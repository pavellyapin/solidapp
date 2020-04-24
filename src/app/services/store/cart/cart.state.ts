import { CartItem } from './cart.model';


export default class CartState {
  items: Array<CartItem>;
  cartId?: string;
  CartError: Error;
}

export const initializeState = (): CartState => {
  return {items : [], CartError: null };
};
