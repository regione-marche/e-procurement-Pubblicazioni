import { Component, OnInit } from '@angular/core';
import { BandiService } from '../../../shared/services/bandi-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionUtil } from '../../../shared/utils/session-util';
import { Constants } from '../../../shared/utils/constants';
import { TabellatiUtil } from '../../../shared/utils/tabellati-utils';
import { environment } from 'src/environments/environment';
import { utils } from 'protractor';
import { elementProperty } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'app-lista-bandi',
  templateUrl: './lista-bandi.component.html',
  styleUrls: ['./lista-bandi.component.css']
})
export class ListaBandiComponent implements OnInit {

  isDataReady : boolean = false;

  listaBandi : any;

  formData : any;

  paginaCorrente : any

  totalePagine : any;

  error = false;

  constructor(private route: ActivatedRoute, private router: Router, private BandiService : BandiService) { }


  ngOnInit() {    
    this.doSearch();
  }


  calculatePagination(){

    let totaleTrovati = this.listaBandi.total;
    let offset = this.listaBandi.offset;
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
    let offset = this.listaBandi.offset;
    let pageLimit = this.formData.limit;
    offset = (page * pageLimit) - pageLimit;
    this.formData.offset = offset;
    SessionUtil.putObjectInSession(Constants.bandiFormData, this.formData);
    this.doSearch();
  }

  doSearch(){
    this.isDataReady = false;
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
        this.BandiService.listaBandi(this)
        .subscribe(bandi => {
          this.listaBandi = bandi;
          this.listaBandi.data.forEach(element => {
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

  dettaglio(id){
    this.router.navigate(['/',  Constants.bandiPath, Constants.dettaglioBandiPath],
      {queryParams : {id : id }}
    );
  }

}
