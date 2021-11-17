import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHandler, HttpXhrBackend } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TabellatiService {

  static readonly url:string = environment.tabellatiServiceUrl;
  
  static http = new HttpClient(new HttpXhrBackend({ build: () => new XMLHttpRequest() }));
  
  static listaRegioni(): Observable<any>{

    return this.http.get<any>(`${this.url}/Regioni`);
    
  }

  static listaProvince(): Observable<any>{

    return this.http.get<any>(`${this.url}/ProvinceIstat`);
    
  }

  static listaAtti(): Observable<any>{

    return this.http.get<any>(`${this.url}/Atti`);
    
  }

  static listaValori(cod): Observable<any> {

    return this.http.get<any>(`${this.url}/Valori?cod=${cod}`);
  }

  static getSADenominazione(saName: string): Observable<any>{
     return this.http.get<any>(`${this.url}/GetSAbyNameOccurrence?saName=${saName}`)
   }
 
  static getSACodFisc(saCF: string): Observable<any>{    
      return this.http.get<any>(`${this.url}/GetSAbyCFOccurrence?saCf=${saCF}`)
    }

}


