import { Entry } from 'contentful';

export default class ProductsState {
  activeCategory?: Entry<any>;
  loadedProducts? : Entry<any>[];
  searchResults? : Entry<any>[];
  productDetails? : Entry<any>;
  reviews? : Array<any>;
  ProductsError: Error;
}

export const initializeState = (): ProductsState => {
  return { ProductsError: null };
};
