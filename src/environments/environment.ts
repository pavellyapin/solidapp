// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  functionsOrigin: 'https://the-bed-shop-ldn.web.app',
  firebase: {
    apiKey: "AIzaSyA57XfB07uQk_tJ2lpGrygI9VYeh0MuVJ0",
    authDomain: "the-bed-shop-ldn.firebaseapp.com",
    databaseURL: "https://the-bed-shop-ldn.firebaseio.com",
    projectId: "the-bed-shop-ldn",
    storageBucket: "the-bed-shop-ldn.appspot.com",
    messagingSenderId: "76544108314",
    appId: "1:76544108314:web:ddcc974716bc99589e2ea3",
    measurementId: "G-F3JGN2FK7S"
  },
  contentful: {
    spaceId: "zu4c0cuo9sxp",
    token: "lmTVRhl_AHzGArqlWv1b0VMattDfD0x4sjJ_Umw8gjQ"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
