// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyDswAZyitSyVq5r1guzikygl_X6NIAz46A',
    authDomain: 'taxiapp-70751.firebaseapp.com',
    databaseURL: 'https://taxiapp-70751.firebaseio.com',
    projectId: 'taxiapp-70751',
    storageBucket: 'taxiapp-70751.appspot.com',
    messagingSenderId: '697356156489'
  },
  nombreEmpresa: 'TRAK MOVIL ARSENALCODE INC.',
  emailEmpresa: 'arsenalcodeinc@gmail.com',
  appChofer: 'Trak Driver',
  appPasajero: 'Trak'
};


/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
