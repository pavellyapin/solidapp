import {
  Component,
  ComponentFactoryResolver,
  Injector,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Card } from 'src/app/components/cards/card';

@Component({
  selector: 'doo-products-spawner',
  templateUrl: './product-cards-spawner.component.html',
  styleUrls: ['./product-cards-spawner.component.scss'],
})
export class ProductCardsSpawnerComponent implements OnInit {
  @ViewChild('spawnproducts', { read: ViewContainerRef, static: true }) container;

  constructor(private resolver: ComponentFactoryResolver) {
  }

  @Input() set card(data: Card) {
    if (!data) {
      return;
    }
    const inputProviders = Object.keys(data.input)
      .map((inputName) => {
        return {
          provide: data.input[inputName].key,
          useValue: data.input[inputName].value, deps: [],
        };
      });
    const injector = Injector.create(
      { providers: inputProviders, parent: this.container.parentInjector },
    );
    const factory = this.resolver.resolveComponentFactory(data.component);
    const component = factory.create(injector);
    this.container.insert(component.hostView);
  }

  ngOnInit() {
  }

}
