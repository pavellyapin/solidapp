import { Entry } from 'contentful';

export default class Product {
  activeCategory?: Entry<any>;
  loadedProducts? : Entry<any>[];
  productDetails? : Entry<any>;
}
