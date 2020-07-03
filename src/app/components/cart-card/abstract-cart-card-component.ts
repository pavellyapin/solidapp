
export abstract class AbstractCartCardComponent {
  protected constructor(readonly name: string,
                        readonly index?: string,
                        readonly object?: any,
                        readonly col?: string,
                        readonly row?: string,
                        readonly color?: string) {
  }

}
