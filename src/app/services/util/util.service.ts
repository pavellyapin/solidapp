import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
    
  bigScreens = new Array('lg' , 'xl' , 'md');

  constructor(public deviceService: DeviceDetectorService) {
  }

  init() {
  }

    loadScript(src? : any , text? : any): Promise<any> {
        if (!text) {
        var scripts = document.getElementsByTagName('script');
            for (var i = scripts.length; i--;) {
                if (scripts[i].src == src) 
                    {
                        return  new Promise((resolve, reject) => {
                            resolve;
                        });  
                    }
            }
        }
        let node = document.createElement('script');
        if (text) {
            node.text = text;
        } else {
            node.src = src;
        }
        node.type = 'text/javascript';
        node.async = true;
        node.charset = 'utf-8';
        document.getElementsByTagName('head')[0].appendChild(node);
        if (text) {
            return new Promise((resolve, reject) => {
                resolve(true);
            }); ;
        }
        return  new Promise((resolve, reject) => {
            node.onload = resolve;
        });  
    }

    isScriptLoaded (src) : Promise<boolean> {
        var scripts = document.getElementsByTagName('script');
        for (var i = scripts.length; i--;) {
            if (scripts[i].src == src) 
                {
                    return new Promise((resolve, reject) => {
                        resolve(true);
                    }); ;
                }
        }

        return new Promise((resolve, reject) => {
            resolve(false);
        }); ;
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