import {InjectionToken} from '@angular/core';
import { Observable } from 'rxjs';
import { Entry } from 'contentful';

export class Card {
  static metadata: any = {
    NAME: new InjectionToken<string>('name'),
    INDEX: new InjectionToken<number>('index'),
    OBJECT : new InjectionToken<Entry<any>>('object'),
    ROUTERLINK: new InjectionToken<string>('routerLink'),
    ICONCLASS: new InjectionToken<string>('iconClass'),
    COLS: new InjectionToken<Observable<number>>('cols'),
    ROWS: new InjectionToken<Observable<number>>('rows'),
    COLOR: new InjectionToken<string>('color')
  };

  constructor(readonly input: {
    name: {
      key: InjectionToken<string>,
      value: string
    },
    index: {
      key: InjectionToken<number>,
      value: number
    },
    object: {
      key: InjectionToken<Entry<any>>,
      value: Entry<any>
    },
    routerLink?: {
      key: InjectionToken<string>,
      value: string
    },
    iconClass?: {
      key: InjectionToken<string>,
      value: string
    },
    cols: {
      key: InjectionToken<Observable<number>>,
      value: Observable<number>
    },
    rows: {
      key: InjectionToken<Observable<number>>,
      value: Observable<number>
    },
    color?: {
      key: InjectionToken<string>,
      value: string
    }
  }, readonly component: any) {
  }

}
