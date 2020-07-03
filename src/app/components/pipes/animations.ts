import {
    trigger,
    state,
    style,
    animate,
    transition
  } from '@angular/animations';

  export const navbarTransition = 
  trigger('navbarAnimation' , [
    state('top', style ({
      'top': '60px'
    })),
    state('bottom', style ({
      'top': '10px'
    })),
    transition('top => bottom', animate('500ms ease-in')),
    transition('bottom => top', animate('500ms ease-out'))
  ]);
