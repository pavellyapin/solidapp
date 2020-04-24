import { Entry } from 'contentful';

export abstract class AbstractCardComponent {
  protected constructor(readonly name: string,
                        readonly index?: string,
                        readonly object?: Entry<any>,
                        readonly routerLink?: string,
                        readonly iconClass?: string,
                        readonly col?: string,
                        readonly row?: string,
                        readonly color?: string) {
  }

}
