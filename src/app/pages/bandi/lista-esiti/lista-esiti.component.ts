import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BandiService } from '../../../shared/services/bandi-service.service';
import { Constants } from '../../../shared/utils/constants';
import { SessionUtil } from '../../../shared/utils/session-util';
import { TabellatiUtil } from '../../../shared/utils/tabellati-utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lista-esiti',
  templateUrl: './lista-esiti.component.html',
  styleUrls: ['./lista-esiti.component.css']
})
export class ListaEsitiComponent implements OnInit {

  isDataReady : boolean = false;

  listaEsiti : any;

  formData : any;

  paginaCorrente : any

  totalePagine : any;

  error = false;

  constructor(private route: ActivatedRoute, private router: Router, private BandiService : BandiService) { }


  ngOnInit() {    
    this.doSearch();
  }


  calculatePagination(){

    let totaleTrovati = this.listaEsiti.total;
    let offset = this.listaEsiti.offset;
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
    let offset = this.listaEsiti.offset;
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
    
        this.BandiService.listaEsiti(this)
        .subscribe(esiti => {

          this.listaEsiti = esiti;
          this.listaEsiti.data.forEach(element => {
            element.provincia = TabellatiUtil.getProvinciaValue(element.provincia);
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

  dettaglio(idGara, numeroPubblicazione){
    this.router.navigate(['/',  Constants.bandiPath, Constants.dettaglioEsitiPath],
      {queryParams : {idGara : idGara, numeroPubblicazione : numeroPubblicazione}}
    );
  }

}

