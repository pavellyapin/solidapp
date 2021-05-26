import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export class CartCard {
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


  static colsMap = new Map([
    ['xs', 24],
    ['sm', 24],
    ['md', 24],
    ['lg', 24],
    ['xl', 24],
  ]);
  static colsMapBig = new Map([
    ['xs', 24],
    ['sm', 24],
    ['md', 24],
    ['lg', 24],
    ['xl', 24],
  ]);
  static rowsMapBig = new Map([
    ['xs', 26],
    ['sm', 12],
    ['md', 10],
    ['lg', 9],
    ['xl', 9],
  ]);

}
