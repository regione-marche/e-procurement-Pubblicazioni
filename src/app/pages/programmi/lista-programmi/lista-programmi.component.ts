import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProgrammiService } from '../../../shared/services/programmi-service.service';
import { SessionUtil } from '../../../shared/utils/session-util';
import { Constants } from '../../../shared/utils/constants';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-lista-programmi',
  templateUrl: './lista-programmi.component.html',
  styleUrls: ['./lista-programmi.component.css']
})
export class ListaProgrammiComponent implements OnInit {

  isDataReady : boolean = false;

  listaProgrammi : any;

  formData : any;

  paginaCorrente : any

  totalePagine : any;

  error = false;

 
  constructor(private route: ActivatedRoute, private router: Router, private ProgrammiService : ProgrammiService) { }

  ngOnInit() {    
    this.doSearch();
  }


  calculatePagination(){

    let totaleTrovati = this.listaProgrammi.total;
    let offset = this.listaProgrammi.offset;
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
    let offset = this.listaProgrammi.offset;
    let pageLimit = this.formData.limit;
    offset = (page * pageLimit) - pageLimit;
    this.formData.offset = offset;
    SessionUtil.putObjectInSession(Constants.programmiFormData, this.formData);
    this.doSearch();
  }

  doSearch(){
    this.isDataReady = false;
    this.error = false;
    if(SessionUtil.getObjectFromSession(Constants.programmiFormData)!== null){
      this.formData = SessionUtil.getObjectFromSession(Constants.programmiFormData);
    } else {
      this.formData = {
        "limit" : 20,
        "offset" : 0,
        "regioneSA": environment.defaultRegione,
        "provinciaSA": "",
        "stazioneAppaltante": "",
        "codiceFiscaleSA": "",
        "tipoProg": "",
        "anno": "",
        "pubblicatoPrimaDel":"",
        "pubblicatoDopoIl":"",
        'sysconSA':environment.defaultSyscon
      };
    }
    this.ProgrammiService.list(this)
        .subscribe(programmi => {
            this.listaProgrammi = programmi;
            this.calculatePagination();                  
            this.isDataReady =true;            
        });
              
  }

  dettaglio(id){
    this.router.navigate(['/',  Constants.programmiPath, Constants.dettaglioPath],
      {queryParams : {id : id }}
    );
  }

  indietro(){
    this.router.navigate(['/', Constants.programmiPath, Constants.ricercaPath]);
  }

}
