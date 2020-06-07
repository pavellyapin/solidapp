import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef, NgZone } from "@angular/core";
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
    name: 'ratePipe'
  })
    export class RatePipe {
        transform(rate:any):any {
          return parseFloat(rate).toFixed(2);
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

  @Pipe({
    name:'timeAgo',
    pure:false
  })
  export class TimeAgoPipe implements PipeTransform, OnDestroy {
    private timer: number;
    constructor(private changeDetectorRef: ChangeDetectorRef, private ngZone: NgZone) {}
    transform(value:string) {
      this.removeTimer();
      let d = new Date(value);
      let now = new Date();
      let seconds = Math.round(Math.abs((now.getTime() - d.getTime())/1000));
      let timeToUpdate = (Number.isNaN(seconds)) ? 1000 : this.getSecondsUntilUpdate(seconds) *1000;
      this.timer = this.ngZone.runOutsideAngular(() => {
        if (typeof window !== 'undefined') {
          return window.setTimeout(() => {
            this.ngZone.run(() => this.changeDetectorRef.markForCheck());
          }, timeToUpdate);
        }
        return null;
      });
      let minutes = Math.round(Math.abs(seconds / 60));
      let hours = Math.round(Math.abs(minutes / 60));
      let days = Math.round(Math.abs(hours / 24));
      let months = Math.round(Math.abs(days/30.416));
      let years = Math.round(Math.abs(days/365));
      if (Number.isNaN(seconds)){
        return '';
      } else if (seconds <= 45) {
        return 'a few seconds ago';
      } else if (seconds <= 90) {
        return 'a minute ago';
      } else if (minutes <= 45) {
        return minutes + ' minutes ago';
      } else if (minutes <= 90) {
        return 'an hour ago';
      } else if (hours <= 22) {
        return hours + ' hours ago';
      } else if (hours <= 36) {
        return 'a day ago';
      } else if (days <= 25) {
        return days + ' days ago';
      } else if (days <= 45) {
        return 'a month ago';
      } else if (days <= 345) {
        return months + ' months ago';
      } else if (days <= 545) {
        return 'a year ago';
      } else { // (days > 545)
        return years + ' years ago';
      }
    }
    ngOnDestroy(): void {
      this.removeTimer();
    }
    private removeTimer() {
      if (this.timer) {
        window.clearTimeout(this.timer);
        this.timer = null;
      }
    }
    private getSecondsUntilUpdate(seconds:number) {
      let min = 60;
      let hr = min * 60;
      let day = hr * 24;
      if (seconds < min) { // less than 1 min, update every 2 secs
        return 2;
      } else if (seconds < hr) { // less than an hour, update every 30 secs
        return 30;
      } else if (seconds < day) { // less then a day, update every 5 mins
        return 300;
      } else { // update every hour
        return 3600;
      }
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
