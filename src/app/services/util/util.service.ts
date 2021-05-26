import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { from, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UtilitiesService {

    bigScreens = new Array('lg', 'xl', 'md');

    bigScreensAndSmall = new Array('lg', 'xl', 'md', 'sm');

    constructor(public deviceService: DeviceDetectorService) {
    }

    init() {
    }

    loadScript(src?: any, text?: any): Observable<any> {

        /**var scripts = document.getElementsByTagName('script');
            for (var i = scripts.length; i--;) {
                if (scripts[i].src == src) 
                    {
                        return  from (new Promise((resolve, reject) => {
                            resolve(true);
                        }));  
                    }
            }**/
        let textNode = document.createElement('script');
        let node = document.createElement('script');

        textNode.text = text;
        node.src = src;

        node.type = 'text/javascript';
        node.async = true;
        node.charset = 'utf-8';
        document.getElementsByTagName('head')[0].appendChild(node);

        textNode.type = 'text/javascript';
        textNode.async = true;
        textNode.charset = 'utf-8';
        document.getElementsByTagName('head')[0].appendChild(textNode);
        
        return from(new Promise((resolve, reject) => {
            console.log('poop');

            node.onload = resolve;
        }));
    }

    isScriptLoaded(src): Promise<boolean> {
        var scripts = document.getElementsByTagName('script');
        for (var i = scripts.length; i--;) {
            if (scripts[i].src == src) {
                return new Promise((resolve, reject) => {
                    resolve(true);
                });;
            }
        }

        return new Promise((resolve, reject) => {
            resolve(false);
        });;
    }

    scrollTop() {
        let scrollToTop = window.setInterval(() => {
            let pos = window.pageYOffset;
            if (pos > 0) {
                window.scrollTo(0, pos - 1000); // how far to scroll on each step
            } else {
                window.clearInterval(scrollToTop);
            }
        }, 5);
    }

    shuffleArray(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }
}