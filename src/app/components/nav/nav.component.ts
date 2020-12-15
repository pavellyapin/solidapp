import {Component, OnInit, ChangeDetectorRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NavigationService, Page} from '../../services/navigation/navigation.service';
import {NavRoute} from '../../services/navigation/nav-routing';
import {AuthService} from '../../services/auth/auth.service';
import { Observable, Subscription } from 'rxjs';
import SettingsState from 'src/app/services/store/settings/settings.state';
import { Store, select } from '@ngrx/store';
import { map, startWith } from 'rxjs/operators';
import { Entry } from 'contentful';
import { sortBanners } from '../pipes/pipes';
import { FormControl } from '@angular/forms';
import * as ProductsActions from 'src/app/services/store/product/product.action';
import { Actions, ofType } from '@ngrx/effects';
import * as CartActions from '../../services/store/cart/cart.action';
import { CartSideNavComponent } from './cart-side-nav/cart-side-nav.component';
import { UtilitiesService } from 'src/app/services/util/util.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  
  isCartOpen:boolean = false;
  isMobileMenuOpen:boolean = false;
  isClosing:boolean = false;
  timerId : any;
  mainMenuOpen = false;
  settings$: Observable<SettingsState>;
  SettingsSubscription: Subscription;
  siteSettings: Entry<any>;
  categories$: Observable<Entry<any>[]>;
  CategoriesSubscription: Subscription;
  categories: Entry<any>[];
  rootCategories: Entry<any>[];
  resolution : any;
  loading : any;
  searchControl = new FormControl();
  filteredOptions: Observable<Entry<any>[]>;
  actionSubscription: Subscription;

  @ViewChild('cartSideNav',{static: false}) 
  public cartSideNavComponent: CartSideNavComponent;


  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService,
    private store: Store<{ settings: SettingsState}>,
    private _actions$: Actions,
    public utilService : UtilitiesService,
    public navService: NavigationService) {

    this.settings$ = store.pipe(select('settings'));
    this.categories$ = store.pipe(select('settings', 'categories'));
  }

  ngOnInit() {


    this.SettingsSubscription = this.settings$
    .pipe(
      map(x => {
        this.resolution = x.resolution;
        this.siteSettings = x.siteConfig;
        this.loading = x.loading;
        this.changeDetectorRef.detectChanges();
      })
    )
    .subscribe();

    this.CategoriesSubscription = this.categories$
    .pipe(
      map(x => {
        if (x) {
          
          this.categories = x.map((item)=>({
            ...item,
            links: []
          }));

          this.filteredOptions = this.searchControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filterSearch(value))
          );

        }
        this.rootCategories = this.categories ? this.categories.
        filter(item => item.fields.root == true).sort(sortBanners) : this.categories;
      })
    )
    .subscribe();

    this.actionSubscription = this._actions$.pipe(ofType(CartActions.BeginAddProductToCartAction)).subscribe(() => {
      this.toggleSideNav(true);    
      });
  }
  
  private _filterSearch(value: string): Entry<any>[] {
    const filterValue = value.toLowerCase();
    return this.categories.filter(category => category.fields.title.toLowerCase().includes(filterValue));
  }

  startSearchProducts($event) {
    this.store.dispatch(ProductsActions.BeginSearchProductsAction({payload : $event}));
    this.router.navigateByUrl('search/' + $event);
    this.searchControl.setValue('');
    this.navService.startLoading();
  }

  public toggleSideNav(autoclose:boolean) {
      this.isCartOpen = !this.isCartOpen;
      if (autoclose) {
        this.timerId = setTimeout(() => {this.isCartOpen = false ; clearTimeout(this.timerId);} , 3000);
      }
  }

  public toggleMobileSideMenu() {
      this.utilService.scrollTop();
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  public expandMainMenu(close?:boolean) {
    this.isCartOpen = false;
    if (this.mainMenuOpen || close) {
      this.mainMenuOpen = false;
    } else {
      this.mainMenuOpen = true;
    }
  }

  expandCartNav() {
    if (this.mainMenuOpen) {
      this.mainMenuOpen = false;
    }
    this.utilService.scrollTop();
    if (!this.isCartOpen || !this.cartSideNavComponent.cartItemCount) {
      this.toggleSideNav(false);
    } else {
      this.goToCart();
    }
  }

  public hideMainMenu() {
    this.mainMenuOpen = false;
  }

  public getNavigationItems(): NavRoute[] {
    return this.navService.getNavigationItems();
  }

  public getActivePage(): Page {
    return this.navService.getActivePage();
  }

  public logout() {
    this.authService.doLogout();
    this.router.navigateByUrl('/');
    // this.router.navigate(['login'], {replaceUrl: true});
  }

  public goToCart() {
    this.navService.startLoading();
    this.router.navigateByUrl('cart');
  }

  public goToFromMobileNav(url) {
    this.toggleMobileSideMenu();
    this.navService.startLoading();
    this.navService.ctaClick(url);
  }

  public getPreviousUrl(): string[] {
    return this.navService.getPreviousUrl();
  }

  ngOnDestroy(): void {
    this.SettingsSubscription.unsubscribe();
    this.CategoriesSubscription.unsubscribe();
    this.actionSubscription.unsubscribe();
  }
}
