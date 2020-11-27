import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2, NgZone, ChangeDetectorRef } from '@angular/core';
import { StateChange } from 'ng-lazyload-image';
import { UtilitiesService } from 'src/app/services/util/util.service';

@Component({
  selector: 'doo-split-screen-img',
  templateUrl: './split-screen-img.component.html',
  styleUrls: ['./split-screen-img.component.scss']
})
export class SplitScreenImagePostComponent implements OnInit {

  @Input() block;
  @Input() resolution;
  imgLoaded: boolean = false;
  @ViewChild('postImg', { static: false }) mediaElement: ElementRef;
  @ViewChild('content', { static: false }) contentElement: ElementRef;
  @ViewChild('mainVid', { static: false })
  public mainVid: any;

  constructor(private renderer: Renderer2,
    private zone: NgZone,
    public utils : UtilitiesService,
    private changeDetectorRef: ChangeDetectorRef, ) {
  }
  ngOnInit() {
    //console.log('split',this.post);
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
        this.zone.run(() => { // <== added
          this.renderer.removeClass(this.mediaElement.nativeElement, 'post-placeholder');
          this.changeDetectorRef.detectChanges();
          this.imgLoaded = true;
        });
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

  ngAfterViewInit() {
    if (this.mainVid) {
      this.mainVid.nativeElement.addEventListener('canplay', () => {
        this.mainVid.nativeElement.muted = true;
        this.mainVid.nativeElement.play()
      }, { passive: true })
    }
  }

}
