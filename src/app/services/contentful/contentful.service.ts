import { Injectable } from '@angular/core';
import { createClient, Entry, EntryCollection } from 'contentful';
import { environment } from '../../../environments/environment';
import { from, Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ContentfulService {
  private client = createClient({
    space: environment.contentful.spaceId,
    accessToken: environment.contentful.token
  });

  getSettings(): Observable<Entry<any>> {
    return from(this.client.getEntries(Object.assign({
      content_type: 'settings',
      include : 3
    }))
      .then(res => res.items.pop()));
  }

  getActiveCategories(): Observable<Entry<any>[]> {
    return from(this.client.getEntries(Object.assign({
      content_type: 'category',
    }))
      .then(res => res.items));
  }

  getCategoryProducts(query?: [string]): Observable<any> {

    const requestArray = [];
    for (let cat of query) {
      requestArray.push(
        this.client.getEntries(Object.assign({
          content_type: 'product',
          links_to_entry : cat
        }))
      );
    }
    return forkJoin(requestArray).pipe(
      map((results: EntryCollection<unknown>[]) => {
        let products:Entry<any>[] = [];
        let productIds = [];
        for (let response of results) {
          for (let product of response.items) {
            if (productIds.indexOf(product.sys.id) == -1) {
              productIds.push(product.sys.id);
              products.push(product);
            }
          }
        }
        return products;
      }));
  }

  searchProducts(query?: object): Observable<Entry<any>[]> {
    return from(this.client.getEntries(Object.assign({
      content_type: 'product',
      'fields.title[match]' : query,
      //limit : '50'
    }))
      .then(res => res.items));
  }

  getProductDetails(query?: any): Observable<Entry<any>> {
    return from(this.client.getEntries(Object.assign({
      content_type: 'product',
      'sys.id' : query,
      include : 3
    }))
      .then(res => res.items.pop()));
  }

  getPage(query?: any): Observable<Entry<any>> {
    return from(this.client.getEntries(Object.assign({
      content_type: 'page',
      'fields.name' : query,
      include : 4
    }))
      .then(res => res.items.pop()));
  }

  getAllPages(): Observable<Entry<any>[]> {
    return from(this.client.getEntries(Object.assign({
      content_type: 'page',
      include : 4
    }))
      .then(res => res.items));
  }

  getPostsForPage(query?: any): Observable<Entry<any>[]> {
    return from(this.client.getEntries(Object.assign({
      content_type: 'post',
      links_to_entry : query
    }))
      .then(res => res.items));
  }
}