import { Component, OnInit, Input } from '@angular/core';
import { UtilitiesService } from 'src/app/services/util/util.service';

@Component({
  selector: 'doo-faq-block',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FAQPostComponent implements OnInit {

  @Input() block;
  @Input() resolution;

  constructor(public utils : UtilitiesService) {
    
  }

  ngOnInit() {
    //console.log('split',this.post);
  }

}
