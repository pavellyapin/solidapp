import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

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


  /* Grid column map */
  static colsMap = environment.cartCard.colsMap;
  /* Big card column span map */
  static colsMapBig = environment.cartCard.colsMapBig;
  /* Small card column span map */
  static rowsMapBig = environment.cartCard.rowsMapBig;

}
