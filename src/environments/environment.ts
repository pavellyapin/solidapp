// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  functionsOrigin: 'https://doodemo.com',
  firebase: {
    apiKey: "AIzaSyDu3VtGYv3v5PtdZDPrdaIfuzO0F_0zCxY",
    authDomain: "my-doo-7c70c.firebaseapp.com",
    databaseURL: "https://my-doo-7c70c.firebaseio.com",
    projectId: "my-doo-7c70c",
    storageBucket: "my-doo-7c70c.appspot.com",
    messagingSenderId: "576378272326"
  },
  contentful: {
    spaceId: "req6f5i83hv4",
    token: "6fc8c31a7d20e273303177e872ad8e0c0d9c6ffbafe77fe415da613aa401d80e"
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
