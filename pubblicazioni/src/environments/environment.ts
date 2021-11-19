// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  programmiServiceUrl : 'https://www.serviziocontrattipubblici.it/WSConsultProg/rest/Programmi',
  bandiServiceUrl : 'https://www.serviziocontrattipubblici.it/WSConsultBandi/rest',
  tabellatiServiceUrl : 'https://www.serviziocontrattipubblici.it/WSTabelleDiContesto/rest/Tabellati',
  filtriRegione: false,
  filtriProvincia: true,
  cfEnte: false,
  atti: true,
  profiloCommittente:false,
  defaultRegione: '',
  defaultSyscon:'',
  minPublishDate:'01/01/2001',
  minSendDate:'01/10/2018',
  statoBandiCompleto:false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
