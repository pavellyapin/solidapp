import { Component, OnInit, Input, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { StateChange } from 'ng-lazyload-image';

@Component({
  selector: 'doo-full-width-img-background-post',
  templateUrl: './full-width-img-background.component.html',
  styleUrls: ['./full-width-img-background.component.scss']
})
export class FullWidthImgBackgroundPostComponent implements OnInit {

  @Input() post;
  @ViewChild('postImg',{static: false}) mediaElement: ElementRef;

  constructor(private renderer: Renderer2) {
    
  }

  ngOnInit() {
    //console.log('post',this.post);
  }

  myCallbackFunction(event: StateChange) {
    switch (event.reason) {
      case 'setup':
        // The lib has been instantiated but we have not done anything yet.
        break;
      case 'observer-emit':
        // The image observer (intersection/scroll observer) has emit a value so we
        // should check if the image is in the viewport.
        // `event.data` is the event in this case.
        break;
      case 'start-loading':
        // The image is in the viewport so the image will start loading
        break;
      case 'mount-image':
        // The image has been loaded successfully so lets put it into the DOM
        break;
      case 'loading-succeeded':
        this.renderer.removeClass(this.mediaElement.nativeElement, 'post-placeholder');
        // The image has successfully been loaded and placed into the DOM
        break;
      case 'loading-failed':
        // The image could not be loaded for some reason.
        // `event.data` is the error in this case
        break;
      case 'finally':
        // The last event before cleaning up
        break;
    }
  }

}
