import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef} from '@angular/core';
import { NavigationService} from '../../../services/navigation/navigation.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { navbarTransition } from '../../pipes/animations';
import { Entry } from 'contentful';

@Component({
  selector: 'app-dashboard-toolbar',
  templateUrl: './dashboard-toolbar.component.html',
  styleUrls: ['./dashboard-toolbar.component.scss'],
  animations: [navbarTransition]
})
export class DashboardToolbarComponent implements OnInit {

  @Input() mainMenuOpen;
  @Output() toggleMobileSideMenu = new EventEmitter();
  @Output() expandMainMenu = new EventEmitter();
  @Output() startSearchProducts = new EventEmitter();
  
  @Input() resolution: any;
  @Input() siteSettings: Entry<any>;
  
  bigScreens = new Array('lg' , 'xl' , 'md')
  lastScrollTop = 0;
  state : any = 'top';
  timerId : any;

  @Input() searchControl : FormControl;
  @ViewChild('searchInput',{static: false}) searchInput: ElementRef;
  @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;

  constructor(
    private router: Router,
    private navService: NavigationService) {
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

  public onToggleMobileSideMenu() {
    this.toggleMobileSideMenu.emit();
  }

  public onExpandMainMenu() {
    this.expandMainMenu.emit();
  }

  searchProducts($event) {
    this.searchInput.nativeElement.blur();
    this.autocomplete.closePanel(); 
    this.startSearchProducts.emit(this.searchControl.value);
  }

  public goToProfile() {
    if (this.navService.getCurrentUrl().pop() != 'account/overview') {
      this.navService.startLoading();
    }
    this.router.navigateByUrl('account/overview');
  }
}
