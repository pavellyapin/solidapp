import { Component, OnInit, Input, Renderer2, ViewChild, ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { StateChange } from 'ng-lazyload-image';
import { NavigationService } from 'src/app/services/navigation/navigation.service';
import { UtilitiesService } from 'src/app/services/util/util.service';

@Component({
  selector: 'doo-background-img-block',
  templateUrl: './background-img.component.html',
  styleUrls: ['./background-img.component.scss']
})
export class BackgroundImageBlockComponent implements OnInit {

  @Input() block;
  @Input() resolution;
  imgLoaded : boolean = false;
  @ViewChild('postImg',{static: false}) mediaElement: ElementRef;
  @ViewChild('content',{static: false}) contentElement: ElementRef;
  @ViewChild('mainVid',{static: false}) mainVid: any;

  constructor(private renderer: Renderer2,
              private zone:NgZone,
              private changeDetectorRef: ChangeDetectorRef,
              public navService : NavigationService,
              public utils : UtilitiesService) {
    
  }

  ngOnInit() {
    //console.log('post',this.block);
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
        this.imgLoaded = true;
      } , {passive:true})
    }
  }

}
