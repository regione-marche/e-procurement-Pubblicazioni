import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProgrammiService {

  readonly url:string = environment.programmiServiceUrl;
  
  constructor(private http : HttpClient) { }


  list(object): Observable<any>{
    let postData = object.formData;
    if(postData.pubblicatoDopoIl != ''){
      postData.pubblicatoDopoIl = this.formatDate(postData.pubblicatoDopoIl);
    } else {
      postData.pubblicatoDopoIl = environment.minPublishDate;  
    }
    if(postData.pubblicatoPrimaDel != ""){
      postData.pubblicatoPrimaDel = this.formatDate(postData.pubblicatoPrimaDel);
    }

    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post<any>(`${this.url}/Lista`,postData, { 
      headers: headers 
    }).pipe(
      catchError(err => {
        object.error = true;
        object.isDataReady =true;      
        return throwError(err);
      })
    );
    
  }

  dettaglio(id, object){
    return this.http.post<any>(`${this.url}/Dettaglio`, parseInt(id)).pipe(
      catchError(err => {
        object.error = true;
        object.isDataReady =true;      
        return throwError(err);
      })
    );
  }

  documento(type, id){
    let headers = new HttpHeaders();
    const options = {
      headers: headers,      
      responseType: 'blob'
    };

    return this.http.get(`${this.url}/${type}?id=${id}`, {responseType: 'blob'});
  }

  formatDate(date){    
    const dateArray = date.split('-');
    if(dateArray.length == 1){
      return dateArray[0];
    }
    const year = dateArray[0];
    const day = dateArray[2].length === 1 ? '0' +  dateArray[2] :  dateArray[2];
    const month = dateArray[1].length === 1 ? '0' + dateArray[1] : dateArray[1];
    return day + '/' + month + '/' + year;
  }

 
}
