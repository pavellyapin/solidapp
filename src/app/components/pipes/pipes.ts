import { Pipe } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Entry } from "contentful";
import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from '@angular/material/core';

@Pipe({
    name: 'imagePipe'
  })
    export class ImagePipe {
      constructor (public sanitizer: DomSanitizer) {}
        transform(url:string):any {
          var fullUrl = 'https:' + url;
          return this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
    }
  }

  @Pipe({
    name: 'richTextPipe'
  })
    export class RichTextPipe {
      constructor () {}
        transform(text):any {
          if (text) {
            return documentToHtmlString(text)
          } else {
            return ''
          }        
          
    }
  }

  @Pipe({
    name: 'pricePipe'
  })
    export class PricePipe {
        transform(price:any):any {
          return '<span class = "currency-label"> CAD$ </span>' + parseFloat(price).toFixed(2);
    }
  }

  @Pipe({
    name: 'datePipe'
  })
    export class DatePipe {
        transform(timestamp:any):any {
          var newDate = new Date();
          newDate.setTime(timestamp);
          return newDate.toLocaleDateString();
    }
  }

  @Pipe({
    name: 'variantsPipe'
  })
    export class VariantsPipe {
        transform(variants:any): string {
          let result = ''
          for (var key in variants) {
            if (!variants.hasOwnProperty(key)) continue;
            result = result + ' | ' + key + " : " + variants[key] 
        }
          return result;
    }
  }

  
export function sortBanners (s1:Entry<any> , s2:Entry<any>) {
    if(s1.fields.order > s2.fields.order) return 1
    else if (s1.fields.order === s2.fields.order) return 0
    else return -1
  
  }

 export function sortMenuItem (s1:Entry<any> , s2:Entry<any>) {
    if(s1.fields.sort > s2.fields.sort) return 1
    else if (s1.fields.sort === s2.fields.sort) return 0
    else return -1

}

export function sortOrdersByDate (order1:any , order2:any) {
  if(order1.order.bookDate.year > order2.order.bookDate.year) return 1
  else if (order1.order.bookDate.year === order2.order.bookDate.year) 
    if (order1.order.bookDate.month > order2.order.bookDate.month) return 1 
      else if (order1.order.bookDate.month === order2.order.bookDate.month)
        if (order1.order.bookDate.day > order2.order.bookDate.day) return 1
          else if (order1.order.bookDate.day === order2.order.bookDate.day) return 0
        else return -1
      else return -1
  else return -1
}


export interface SelectValue {
  value: string;
  viewValue: string;
}

export interface ClientOrder {
  client: string;
  order: string;
  partner?:string;
}

export interface Partner {
  info: string;
  orders?: string;
}

export interface DateObject {
  day: number;
  month: number;
  year: number;
}


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
