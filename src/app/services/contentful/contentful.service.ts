import { Injectable } from '@angular/core';
import { createClient, Entry } from 'contentful';
import { environment } from '../../../environments/environment';
import { from, Observable } from 'rxjs';

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

  getCategoryProducts(query?: object): Observable<Entry<any>[]> {
    return from(this.client.getEntries(Object.assign({
      content_type: 'product',
      links_to_entry : query,
      //limit : '50'
    }))
      .then(res => res.items));
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
      'fields.name' : query
    }))
      .then(res => res.items.pop()));
  }

  getAllPages(): Observable<Entry<any>[]> {
    return from(this.client.getEntries(Object.assign({
      content_type: 'page',
      include : 3
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