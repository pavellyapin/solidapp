import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Entry } from 'contentful';
import { sortBanners } from '../../pipes/pipes';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { environment } from 'src/environments/environment';
import { NavigationService } from 'src/app/services/navigation/navigation.service';

@Component({
  selector: 'doo-mobile-side-nav',
  templateUrl: './mobile-side-nav.component.html',
  styleUrls: ['./mobile-side-nav.component.scss'],
})
export class MobileSideNavComponent implements OnInit {

  @Output() startSearchProducts = new EventEmitter();

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


  @Output() goToURL: EventEmitter<any> = new EventEmitter();
  @Input() searchControl: FormControl;
  @Input() filteredOptions: Observable<Entry<any>[]>;
  @ViewChild('searchInput', { static: false }) searchInput: ElementRef;
  @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;

  activeCategory: Entry<any>;
  subCategories: Entry<any>[];
  menuTree: any[];
  environment = environment;

  constructor(public navService: NavigationService) {

  }

  ngOnInit() {

  }

  buildSubCategory(category) {
    let subCategories = this._categories.filter(item => {
      if (item.fields.parent && item.fields.parent.fields) {
        return item.fields.parent.fields.name == category.fields.name
      }
    }
    );
    subCategories.sort(sortBanners);
    subCategories.forEach(function (subCategory) {
      let links = this._categories.filter(item => {
        if (item.fields.parent && item.fields.parent.fields) {
          return item.fields.parent.fields.name == subCategory.fields.name
        }
      });
      links.sort(sortBanners);
      subCategory.links = links;
    }.bind(this));

    return subCategories;
  }

  buildMenu() {
    this.menuTree = this._rootCategories.map((item) => ({
      ...item,
      subCategories: this.buildSubCategory(item)
    }));
  }

  public navigateTo(cta, isRoot) {
    if (!isRoot) {
      this.goToURL.emit(cta);
    } else if (cta.fields.redirect && isRoot) {
      this.goToURL.emit(cta.fields.redirect);
    }
  }

  searchProducts($event) {
    this.searchInput.nativeElement.blur();
    this.autocomplete.closePanel();
    this.startSearchProducts.emit(this.searchControl.value);
  }

}