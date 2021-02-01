import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef, NgZone } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Entry } from "contentful";
import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from '@angular/material/core';
import { Store, select } from '@ngrx/store';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'imagePipe'
})
export class ImagePipe {
  constructor(public sanitizer: DomSanitizer) { }
  transform(url: string): any {
    var fullUrl = 'https:' + url;
    return fullUrl;
    //return this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
  }
}

@Pipe({
  name: 'richTextPipe'
})
export class RichTextPipe {
  constructor() { }
  transform(text): any {
    if (text) {
      let options = {
        renderNode: {
          'embedded-asset-block': (node) =>
            `<img class="img-wrap" src="${node.data.target.fields.file.url}"/>`
        }
      }
      return documentToHtmlString(text, options);
    } else {
      return ''
    }

  }
}

@Pipe({
  name: 'pricePipe'
})
export class PricePipe {
  settings$: Observable<Entry<any>>;
  SettingsSubscription: Subscription;
  siteConfig: Entry<any>;
  constructor(store: Store<{ settings: SettingsState }>) {
    this.settings$ = store.pipe(select('settings', 'siteConfig'));

    this.SettingsSubscription = this.settings$
      .pipe(
        map(x => {
          this.siteConfig = x;
        }
        )).subscribe();
  }

  transform(price: any, isSimple?: boolean): any {
    if (price && this.siteConfig && this.siteConfig.fields.currancy == "Canadian Dollar") {
      if (isSimple) {
        return 'CAD$' + parseFloat(price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } else {
        return '<span class = "currency-label"> CAD$ </span>' + parseFloat(price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    } else if (price && this.siteConfig && this.siteConfig.fields.currancy == "British Pound") {
      if (isSimple) {
        return 'GBP£' + parseFloat(price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } else {
        return '<span class = "currency-label"> GBP£ </span>' + parseFloat(price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    } else {
      return 'FREE';
    }
  }

  ngOnDestroy(): void {
    this.SettingsSubscription.unsubscribe();
  }
}

@Pipe({
  name: 'ratePipe'
})
export class RatePipe {
  transform(rate: any): any {
    return parseFloat(rate).toFixed(2);
  }
}

@Pipe({
  name: 'datePipe'
})
export class DatePipe {
  transform(timestamp: any): any {
    var newDate = new Date();
    newDate.setTime(timestamp);
    return newDate.toLocaleDateString();
  }
}

@Pipe({
  name: 'variantsPipe'
})
export class VariantsPipe {
  transform(variants: any): string {
    let result = ''
    for (var key in variants) {
      if (!variants.hasOwnProperty(key)) continue;
      result = result + ' | ' + key + " : " + variants[key]
    }
    return result;
  }
}

@Pipe({
  name: 'timeAgo',
  pure: false
})
export class TimeAgoPipe implements PipeTransform, OnDestroy {
  private timer: number;
  constructor(private changeDetectorRef: ChangeDetectorRef, private ngZone: NgZone) { }
  transform(value: string) {
    this.removeTimer();
    let d = new Date(value);
    let now = new Date();
    let seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));
    let timeToUpdate = (Number.isNaN(seconds)) ? 1000 : this.getSecondsUntilUpdate(seconds) * 1000;
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
    let months = Math.round(Math.abs(days / 30.416));
    let years = Math.round(Math.abs(days / 365));
    if (Number.isNaN(seconds)) {
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
  private getSecondsUntilUpdate(seconds: number) {
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

export function sortBanners(s1: Entry<any>, s2: Entry<any>) {
  if (s1.fields.order > s2.fields.order) return 1
  else if (s1.fields.order === s2.fields.order) return 0
  else return -1

}

export function sortReviews(s1: any, s2: any) {
  if (s1.date < s2.date) return 1
  else if (s1.date === s2.date) return 0
  else return -1
}

export function sortOrders(s1: any, s2: any) {
  if (s1.cart.date < s2.cart.date) return 1
  else if (s1.cart.date === s2.cart.date) return 0
  else return -1
}


export interface SelectValue {
  value: string;
  viewValue: string;
}


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
