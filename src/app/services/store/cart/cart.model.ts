
export default class Cart {
  items?: Array<CartItem>;
  cartid? : any;
  
}

export class CartItem {
    productId:string;
    variants?: any;
    qty?: number;
    price : number;
}