import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BandiService {

  readonly url:string = environment.bandiServiceUrl;
  
  constructor(private http : HttpClient) { }

  listaBandi(object){
    let formData = object.formData;
    let headers = new HttpHeaders();
    const postBody  = this.getFormBody(formData);

    return this.http.post(`${this.url}/Bandi/Lista?page_limit=${formData.limit}&offset=${formData.offset}`,
    postBody.toString(),
    {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
    }).pipe(
      catchError(err => {
        object.error = true;
        object.isDataReady =true;      
        return throwError(err);
      })
    );
  }

  listaAtti(object){
    let formData = object.formData;    
    formData.atto = 'S';
    let headers = new HttpHeaders();
    const postBody  = this.getFormBody(formData);
    return this.http.post(`${this.url}/Bandi/Lista?page_limit=${formData.limit}&offset=${formData.offset}`,
    postBody.toString(),
    {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
    }).pipe(
      catchError(err => {
        object.error = true;
        object.isDataReady =true;      
        return throwError(err);
      })
    );
  }


  listaAvvisi(object){
    let formData = object.formData;
    const postBody  = this.getFormBody(formData);
    return this.http.post(`${this.url}/Avvisi/Lista?page_limit=${formData.limit}&offset=${formData.offset}`,
    postBody.toString(),
    {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
    }).pipe(
      catchError(err => {
        object.error = true;
        object.isDataReady =true;      
        return throwError(err);
      })
    );
  }

  listaEsiti(object){
    let formData = object.formData;
    let headers = new HttpHeaders();
    const postBody  = this.getFormBody(formData);

    return this.http.post(`${this.url}/Esiti/Lista?page_limit=${formData.limit}&offset=${formData.offset}`,
    postBody.toString(),
    {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
    }).pipe(
      catchError(err => {
        object.error = true;
        object.isDataReady =true;      
        return throwError(err);
      })
    );
  }

  getFormBody(formData): any{
    console.log(formData);
    let body = new HttpParams();
    if(formData.stato != ""){
      if(formData.atto != null){
         body = body.append('stato', "3");
      } else  {
         body = body.append('stato', formData.stato);
      }
    }
    
    if(formData.regioneSA != "")
      body = body.append('regioneSA', formData.regioneSA);
    if(formData.provinciaSA != "")
      body = body.append('provinciaSA', formData.provinciaSA);
    if(formData.stazioneAppaltante != "")
      body = body.append('stazioneAppaltante', formData.stazioneAppaltante);
    if(formData.tipoBando != "")
      body = body.append('tipoBando', formData.tipoBando);
    if(formData.categoria != "")
      body = body.append('categoria', formData.categoria);
    if(formData.importo != "")
      body = body.append('importo', formData.importo);
    if(formData.importoDa != "")
      body = body.append('importoDa', formData.importoDa);
    if(formData.pubblicatoDopoIl != "")
      body = body.append('pubblicatoDopoIl', this.formatDate(formData.pubblicatoDopoIl));
    else
      body = body.append('pubblicatoDopoIl',environment.minPublishDate);    
    if(formData.pubblicatoPrimaDel != "")
      body = body.append('pubblicatoPrimaDel', this.formatDate(formData.pubblicatoPrimaDel));
    if(formData.trasmessoDopoIl != "")
      body = body.append('trasmessoDopoIl', this.formatDate(formData.trasmessoDopoIl));
    else
      body = body.append('trasmessoDopoIl',environment.minSendDate); 
    if(formData.trasmessoPrimaDel != "")
      body = body.append('trasmessoPrimaDel', this.formatDate(formData.trasmessoPrimaDel));
    if(formData.codiceCpv != "")
      body = body.append('codiceCpv', formData.codiceCpv);
    if(formData.oggetto != "")
      body = body.append('oggetto', formData.oggetto);
    if(formData.cig != "")
      body = body.append('cig', formData.cig);
    if(formData.atto != null){      
      body = body.append('atto','S');
      if(formData.tipoAtto != null && formData.tipoAtto != ''){ 
        body = body.append('tipoAtto',formData.tipoAtto);
      }
    }
    if(formData.codiceFiscaleSA != ""){      
      body = body.append('codiceFiscaleSA',formData.codiceFiscaleSA);
    }
    if(formData.sysconSA != ""){      
      body = body.append('sysconSA',formData.sysconSA);
    }
    if(formData.sceltaContr != ""){      
      body = body.append('sceltaContr',formData.sceltaContr);
    }
    
    
    return body;
  }

  formatDate(date){    
    const dateArray = date.split('-');
    const year = dateArray[0];
    const day = dateArray[2].length === 1 ? '0' +  dateArray[2] :  dateArray[2];
    const month = dateArray[1].length === 1 ? '0' + dateArray[1] : dateArray[1];
    return day + '/' + month + '/' + year;
 
}


  getCpv(cods : string[]): Observable<any>{

    if(cods.length == 1){
      if(cods[0]=="0"){
        return this.getCpv0();
      } else {
        return this.getCpv1(cods[0]);
      }
    }
    if(cods.length == 2){
      return this.getCpv2(cods[0],cods[1]);
    }
    if(cods.length == 3){
      return this.getCpv3(cods[0],cods[1],cods[2]);
    }

  }

  getCpv0(): Observable<any>{
    return this.http.get<any>(`${this.url}/CPV/Cod0`).pipe(
      catchError(this.handleError)
    );
  }

  getCpv1(cod0): Observable<any>{
    return this.http.get<any>(`${this.url}/CPV/Cod1?cod0=${cod0}`).pipe(
      catchError(this.handleError)
    );
  }

  getCpv2(cod0, cod1): Observable<any>{
    return this.http.get<any>(`${this.url}/CPV/Cod2?cod0=${cod0}&cod1=${cod1}`).pipe(
      catchError(this.handleError)
    );
  }

  getCpv3(cod0, cod1, cod2): Observable<any>{
    return this.http.get<any>(`${this.url}/CPV/Cod3?cod0=${cod0}&cod1=${cod1}&cod2=${cod2}`).pipe(
      catchError(this.handleError)
    );
  }

  dettaglioBando(id, object){
    return this.http.post<any>(`${this.url}/Bandi/Dettaglio`, parseInt(id)).pipe(
      catchError(err => {
        object.error = true;
        object.isDataReady =true;      
        return throwError(err);
      })
    );;
  }

  dettaglioAvviso(id, codiceSA, codiceSistema, object){
    return this.http.post<any>(`${this.url}/Avvisi/Dettaglio?codiceSA=${codiceSA}&codiceSistema=${codiceSistema}`, parseInt(id)).pipe(
      catchError(err => {
        object.error = true;
        object.isDataReady =true;      
        return throwError(err);
      })
    );;
  }

  dettaglioEsito(idGara, numeroPubblicazione, object){
    return this.http.post<any>(`${this.url}/Esiti/Dettaglio?numeroPubblicazione=${numeroPubblicazione}`, parseInt(idGara)).pipe(
      catchError(err => {
        object.error = true;
        object.isDataReady =true;      
        return throwError(err);
      })
    );;
  }

  handleError(){
    return [];
  }



}
