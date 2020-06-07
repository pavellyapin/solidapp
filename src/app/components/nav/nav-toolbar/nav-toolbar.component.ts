import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef} from '@angular/core';
import {Page, NavigationService} from '../../../services/navigation/navigation.service';
import { Router } from '@angular/router';
import { Entry } from 'contentful';
import { sortBanners } from '../../pipes/pipes';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-nav-toolbar',
  templateUrl: './nav-toolbar.component.html',
  styleUrls: ['./nav-toolbar.component.scss'],
})
export class NavToolbarComponent implements OnInit {

  @Input() activePage: Page;
  @Input() previousUrl: string[];
  @Input() mainMenuOpen;
  @Output() toggleSideNav = new EventEmitter();
  @Output() toggleMobileSideMenu = new EventEmitter();
  @Output() expandMainMenu = new EventEmitter();
  @Output() startSearchProducts = new EventEmitter();
  @Output() logout = new EventEmitter();
  
  @Input() siteSettings: Entry<any>;
  @Input() categories: Entry<any>[];
  @Input() resolution: any;
  @Input() rootCategories: Entry<any>[];
  @Input() cartItemCount:number;
  activeCategory: Entry<any>;
  subCategories: Entry<any>[];
  bigScreens = new Array('lg' , 'xl' , 'md' , 'sm')
  constructor(
    private router: Router,
    private navService: NavigationService) {
  }
  @Input() searchControl : FormControl;
  @Input() filteredOptions: Observable<Entry<any>[]>;
  @ViewChild('searchInput',{static: false}) searchInput: ElementRef;
  @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;

  ngOnInit() {

  }


  public navigateHome() {
    this.router.navigateByUrl('/');
  }

  public navigateCategory(link) {
    if (this.navService.getCurrentUrl().pop() != link) {
      this.navService.startLoading();
    }
    this.navService.resetStack([link]);
    this.onExpandMainMenu();
    this.router.navigateByUrl('cat/' + link);
  }

  public expandMenu(categoryObject:any) {
    if (categoryObject.fields.redirect) {
      if (categoryObject.fields.redirect.sys.contentType.sys.id == 'page') {
        this.router.navigateByUrl('page/' + categoryObject.fields.redirect.fields.name);
        return;
      }
      if (categoryObject.fields.redirect.sys.contentType.sys.id == 'category') {
        this.router.navigateByUrl('cat/' + categoryObject.fields.redirect.fields.name);
        return;
      }
    }

    let category = categoryObject.fields.name;
    if (!this.activeCategory) {
      this.buildMenu(category);
      this.onExpandMainMenu();
    } else {
      if (this.activeCategory.fields.name == category) {
        this.onExpandMainMenu();
      } else {
        if (this.mainMenuOpen) {
          this.buildMenu(category);
        } else {
          this.buildMenu(category);
          this.onExpandMainMenu();
        }
      }
    }
  }

  public buildMenu(category) {
    this.activeCategory = this.categories.filter(item => item.fields.name == category).pop();
    this.subCategories = this.categories.filter(item => {
          if(item.fields.parent && item.fields.parent.fields) {
            return item.fields.parent.fields.name == category
          }
        }
      );
    this.subCategories.sort(sortBanners);
    this.subCategories.forEach(function (subCategory) {
      let links = this.categories.filter(item => {
        if(item.fields.parent && item.fields.parent.fields) {
          return item.fields.parent.fields.name == subCategory.fields.name
        }
      });
      links.sort(sortBanners);
      subCategory.links = links;
    }.bind(this));
  }

  public onToggleSideNav() {
    this.toggleSideNav.emit();
  }

  public onToggleMobileSideMenu() {
    this.toggleMobileSideMenu.emit();
  }

  public onExpandMainMenu() {
    this.expandMainMenu.emit();
  }

  public onLogout() {
    this.logout.emit();
  }

  searchProducts($event) {
    this.searchInput.nativeElement.blur();
    this.autocomplete.closePanel(); 
    this.startSearchProducts.emit(this.searchControl.value);
  }

  public goToProfile() {
    if (this.navService.getCurrentUrl().pop() != 'account/profile') {
      this.navService.startLoading();
    }
    this.router.navigateByUrl('account/profile');
  }

  public goToCart() {
    if (this.navService.getCurrentUrl().pop() != 'cart') {
      this.navService.startLoading();
    }
    this.router.navigateByUrl('cart');
  }

  public goToFavorites() {
    this.navService.startLoading();
    this.router.navigateByUrl('account/favorites');
  }
}
