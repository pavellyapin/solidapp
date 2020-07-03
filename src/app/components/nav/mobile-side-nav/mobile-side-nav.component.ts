import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { Entry } from 'contentful';
import { sortBanners } from '../../pipes/pipes';

@Component({
  selector: 'doo-mobile-side-nav',
  templateUrl: './mobile-side-nav.component.html',
  styleUrls: ['./mobile-side-nav.component.scss'],
})
export class MobileSideNavComponent implements OnInit {

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

      public navigateTo(cta , isRoot) {
        if (!isRoot) {
          this.goToURL.emit(cta);
        } else if (cta.fields.redirect && isRoot) {
          this.goToURL.emit(cta.fields.redirect);
        }
      }

}