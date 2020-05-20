import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { Entry } from 'contentful';
import { sortBanners } from '../../pipes/pipes';

@Component({
  selector: 'doo-menu-side-nav',
  templateUrl: './menu-side-nav.component.html',
  styleUrls: ['./menu-side-nav.component.scss'],
})
export class MenuSideNavComponent implements OnInit {

    _categories: Entry<any>[];

    @Input() set categories(value: Entry<any>[]) {

        this._categories = value;
        if (this._rootCategories) {
          this.buildMenu();
      }
 
     }

     _rootCategories: any[];

     @Input() set rootCategories(value: any[]) {
        this._rootCategories = value;

     }

    
    @Output() goToURL : EventEmitter<any> = new EventEmitter();
    
    activeCategory: Entry<any>;
    subCategories: Entry<any>[];
    menuTree: any[];

    constructor() {
        
    }

    ngOnInit() {
        
    }

    buildSubCategory(category) {
        let subCategories = this._categories.filter(item => {
            if(item.fields.parent && item.fields.parent.fields) {
              return item.fields.parent.fields.name == category.fields.name
            }
          }
        );
        subCategories.sort(sortBanners);
        subCategories.forEach(function (subCategory) {
          let links = this._categories.filter(item => {
            if(item.fields.parent && item.fields.parent.fields) {
              return item.fields.parent.fields.name == subCategory.fields.name
            }
          });
          links.sort(sortBanners);
          subCategory.links = links;
        }.bind(this));

        return subCategories;
    }

   buildMenu() {
        this.menuTree = this._rootCategories.map((item)=>({
            ...item,
            subCategories: this.buildSubCategory(item)
          }));
      }

      public navigateTo(url) {
        this.goToURL.emit(url);
      }

}