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
  selector: 'doo-cart-cards-spawner',
  templateUrl: './cart-cards-spawner.component.html',
  styleUrls: ['./cart-cards-spawner.component.scss'],
})
export class CartCardsSpawnerComponent implements OnInit {
  @ViewChild('spawncartcards', { read: ViewContainerRef, static: true }) container;

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
