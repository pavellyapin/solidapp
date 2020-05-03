import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import SettingsState from '../store/settings/settings.state';
import * as SettingsActions from 'src/app/services/store/settings/settings.action';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {

  constructor() {
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
}
