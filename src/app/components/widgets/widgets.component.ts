import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'doo-widgets',
  templateUrl: './widgets.component.html',
})
export class WidgetsComponent implements OnInit {

  @Input() widget;

  constructor() {
    
  }

  ngOnInit() {
      //console.log('widget' , this.widget);
  }

}
