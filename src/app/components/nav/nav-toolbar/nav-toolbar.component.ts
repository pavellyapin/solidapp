import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef} from '@angular/core';
import {Page, NavigationService} from '../../../services/navigation/navigation.service';
import { Router } from '@angular/router';
import { Entry } from 'contentful';
import { sortBanners } from '../../pipes/pipes';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { navbarTransition } from '../../pipes/animations';

@Component({
  selector: 'app-nav-toolbar',
  templateUrl: './nav-toolbar.component.html',
  styleUrls: ['./nav-toolbar.component.scss'],
  animations: [navbarTransition]
})
export class NavToolbarComponent implements OnInit {

  @Input() activePage: Page;
  @Input() previousUrl: string[];
  @Input() mainMenuOpen;
  @Output() toggleMobileSideMenu = new EventEmitter();
  @Output() expandMainMenu = new EventEmitter();
  @Output() expandCartNav = new EventEmitter();
  @Output() startSearchProducts = new EventEmitter();
  @Output() logout = new EventEmitter();
  
  @Input() siteSettings: Entry<any>;
  @Input() categories: Entry<any>[];
  @Input() resolution: any;
  @Input() rootCategories: Entry<any>[];
  @Input() cartItemCount:number;
  activeCategory: Entry<any>;
  subCategories: Entry<any>[];
  bigScreens = new Array('lg' , 'xl' , 'md')
  lastScrollTop = 0;
  state : any = 'top';
  timerId : any;

  @Input() searchControl : FormControl;
  @Input() filteredOptions: Observable<Entry<any>[]>;
  @ViewChild('searchInput',{static: false}) searchInput: ElementRef;
  @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;

  constructor(
    private router: Router,
    public navService: NavigationService) {
      window.addEventListener('scroll', () => {
        var st = window.pageYOffset || document.documentElement.scrollTop;
        if (st > this.lastScrollTop && !this.mainMenuOpen){
          if (this.state == 'top') {
            this.state = 'bottom'
            this.timerId = setTimeout(() => {this.state = 'top' ; clearTimeout(this.timerId);} , 3000);
          }
        } else {
           this.state = 'top'
        }
        this.lastScrollTop = st <= 0 ? 0 : st;
      } , {passive:true})
  }

  ngOnInit() {

  }


  public navigateHome() {
    this.router.navigateByUrl('/');
  }

  public navigateCategory(link) {
    if (link.fields.redirect) {
      this.onExpandMainMenu();
      this.navService.ctaClick(link.fields.redirect);
      return;
    }
    
    this.onExpandMainMenu();
    this.router.navigateByUrl('cat/' + link.fields.name);
  }

  public expandMenu(categoryObject:any) {
    if (categoryObject.fields.redirect) {
      this.onExpandMainMenu(true);
      this.navService.ctaClick(categoryObject.fields.redirect);
      return;
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

  public onToggleMobileSideMenu() {
    this.toggleMobileSideMenu.emit();
  }

  public onExpandMainMenu(closed?:boolean) {
    this.expandMainMenu.emit(closed);
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
    if (this.mainMenuOpen) {
      this.onExpandMainMenu();
    }
    if (this.navService.getCurrentUrl().pop() && !this.navService.getCurrentUrl().pop().match('account')) {
      this.navService.startLoading();
    }
    this.router.navigateByUrl('account/overview');
  }

  public goToCart() {
    this.expandCartNav.emit();
    /*if (this.navService.getCurrentUrl().pop() != 'cart') {
      this.navService.startLoading();
    }
    this.router.navigateByUrl('cart');*/
  }

  public goToFavorites() {
    if (this.mainMenuOpen) {
      this.onExpandMainMenu();
    }
    if (this.navService.getCurrentUrl().pop() != 'account/overview') {
      this.navService.startLoading();
    }
    this.router.navigateByUrl('account/favorites');
  }
}
