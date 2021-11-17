import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BandiService } from '../../../shared/services/bandi-service.service';
import { SessionUtil } from '../../../shared/utils/session-util';
import { Constants } from '../../../shared/utils/constants';
import { TabellatiUtil } from '../../../shared/utils/tabellati-utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lista-avvisi',
  templateUrl: './lista-avvisi.component.html',
  styleUrls: ['./lista-avvisi.component.css']
})
export class ListaAvvisiComponent implements OnInit {

  isDataReady : boolean = false;

  listaAvvisi : any;

  formData : any;

  paginaCorrente : any

  totalePagine : any;

  error = false;
  
  constructor(private route: ActivatedRoute, private router: Router, private BandiService : BandiService) { }


  ngOnInit() {    
    this.doSearch();
  }


  calculatePagination(){

    let totaleTrovati = this.listaAvvisi.total;
    let offset = this.listaAvvisi.offset;
    let pageLimit = this.formData.limit;
   
    if(totaleTrovati>0){
      this.totalePagine = Math.floor(totaleTrovati/pageLimit); 
      if(totaleTrovati%pageLimit>0 ) {
        this.totalePagine = this.totalePagine +1;
      }
      
      this.paginaCorrente = Math.floor((offset +1 +pageLimit)/pageLimit);
    }
  }

  pagelink(page){
    let offset = this.listaAvvisi.offset;
    let pageLimit = this.formData.limit;
    offset = (page * pageLimit) - pageLimit;
    this.formData.offset = offset;
    SessionUtil.putObjectInSession(Constants.bandiFormData, this.formData);
    this.doSearch();
  }

  doSearch(){
    this.isDataReady = false;
    this.error = false;
   
      if(SessionUtil.getObjectFromSession(Constants.bandiFormData)!== null){
        this.formData = SessionUtil.getObjectFromSession(Constants.bandiFormData);
      } else {
        this.formData =  {
          'limit' : 20,
          'offset' : 0,
          'stato' : '1',
          'ricercaIn': '1',
          'regioneSA' : environment.defaultRegione,
          'provinciaSA' : '',
          'stazioneAppaltante' : '',
          'tipoBando' : '',
          'categoria' : '',
          'importo' : '',
          'importoDa' : '',
          'pubblicatoDopoIl' : '',
          'pubblicatoPrimaDel' : '',
          'trasmessoDopoIl' : '',
          'trasmessoPrimaDel' : '',
          'codiceCpv' : '',
          'oggetto' : '',
          'cig' : '',
          'codiceFiscaleSA':'',
          'tipoAtto':'',
          'sysconSA':environment.defaultSyscon,
          'sceltaContr':''
        };
      }
    
        this.BandiService.listaAvvisi(this)
        .subscribe(avvisi => {

          this.listaAvvisi = avvisi;
          this.listaAvvisi.data.forEach(element => {
            element.provincia = TabellatiUtil.getProvinciaValue(element.provincia);
            element.tipologia = TabellatiUtil.getTipoAvvisoValue(element.tipologia);
            if(element.storico != null){
              element.storicoData = TabellatiUtil.getTestoStorico(element.storico);
            }
         });
          this.calculatePagination();       
          this.isDataReady =true;            
        });
      
  }

  indietro(){
    this.router.navigate(['/', Constants.bandiPath, Constants.ricercaPath]);
  }


  dettaglio(id, codiceSA, codiceSistema){
    this.router.navigate(['/',  Constants.bandiPath, Constants.dettaglioAvvisiPath],
      {queryParams : {id : id, codiceSA : codiceSA, codiceSistema: codiceSistema}}
    );
  }
}

