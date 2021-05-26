import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export class Card {
  static metadata: any = {
    NAME: new InjectionToken<string>('name'),
    INDEX: new InjectionToken<number>('index'),
    OBJECT: new InjectionToken<any>('object'),
    COLS: new InjectionToken<Observable<number>>('cols'),
    ROWS: new InjectionToken<Observable<number>>('rows'),
    COLOR: new InjectionToken<string>('color'),
    STYLE: new InjectionToken<string>('style')
  };

  constructor(readonly input: {
    name: {
      key: InjectionToken<string>,
      value: string
    },
    index?: {
      key: InjectionToken<number>,
      value: number
    },
    object?: {
      key: InjectionToken<any>,
      value: any
    },
    cols?: {
      key: InjectionToken<Observable<number>>,
      value: Observable<number>
    },
    rows?: {
      key: InjectionToken<Observable<number>>,
      value: Observable<number>
    },
    color?: {
      key: InjectionToken<string>,
      value: string
    }
    style?: {
      key: InjectionToken<string>,
      value: string
    }
  }, readonly component: any) {
  }

  /* Grid column map */
  static colsMap = new Map([
    ['xs', 24],
    ['sm', 24],
    ['md', 24],
    ['lg', 24],
    ['xl', 24],
  ]);
  /* Big card column span map */
  static colsMapBig = new Map([
    ['xs', 12],
    ['sm', 8],
    ['md', 6],
    ['lg', 6],
    ['xl', 6],
  ]);
  /* Small card column span map */
  static rowsMapBig = new Map([
    ['xs', 24],
    ['sm', 14],
    ['md', 12],
    ['lg', 11],
    ['xl', 11],
  ]);

}
