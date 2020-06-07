import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Card } from 'src/app/components/cards/card';

@Injectable()
export class ProductCardsService {

  constructor() {
  }

  cards: BehaviorSubject<Card[]> = new BehaviorSubject<Card[]>([]);

  addCard(card: Card): void {
    this.cards.next(this.cards.getValue().concat(card));
  }

  resetCards(): void {
    this.cards.getValue().splice(0,this.cards.getValue().length);
  }

}
