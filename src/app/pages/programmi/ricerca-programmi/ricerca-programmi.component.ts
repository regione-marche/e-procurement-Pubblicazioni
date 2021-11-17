import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ProgrammiService } from '../../../shared/services/programmi-service.service';
import { SessionUtil } from '../../../shared/utils/session-util';
import { Constants } from '../../../shared/utils/constants';
import { TabellatiUtil } from '../../../shared/utils/tabellati-utils';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-ricerca-programmi',
  templateUrl: './ricerca-programmi.component.html',
  styleUrls: ['./ricerca-programmi.component.css']
})
export class RicercaProgrammiComponent implements OnInit {

  errors = [];

  formData : any = {
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

  isDataReady:boolean = false;

  listaRegioni = [];

  listaProvince = [];

  tipiProg = [];

  listaProgrammi = {}

  session : SessionUtil;

  filtriRegione: boolean = environment.filtriRegione;

  filtriProvincia: boolean = environment.filtriProvincia; 

  filtroCfEnte: boolean = environment.cfEnte;

  profiloCommittente = environment.profiloCommittente;

  minDateFilter = '';

  constructor(private ProgrammiService: ProgrammiService,
    private router: Router) { }

  ngOnInit() {

    this.minDateFilter = this.formatDateToPicker(environment.minPublishDate);
    if(SessionUtil.getObjectFromSession(Constants.programmiFormData) != null){
      this.formData = SessionUtil.getObjectFromSession(Constants.programmiFormData);
    }
    TabellatiUtil.initializeTabellatiProgrammi(this);    
  }


  cerca(){
    if(this.validate()){
      this.formData.offset = 0;
      SessionUtil.putObjectInSession(Constants.programmiFormData, this.formData);
      this.router.navigate(['/', Constants.programmiPath, Constants.listaPath]);
    }
  }

  updateProvince(){
    let regioneCode = this.formData.regioneSA;    
    this.listaProvince = TabellatiUtil.getProvinciaByRegione(regioneCode);
    this.formData.provinciaSA = '';
  }
  

  validate(){

    this.errors = [];
    if(this.formData.pubblicatoPrimaDel != ''){
      if(!Date.parse(this.formData.pubblicatoPrimaDel)){
        this.errors.push['Il campo pubblicato prima del deve avere il formato gg/mm/aaaa'];
      }

    }
    if(this.formData.pubblicatoDopoIl != ''){
      if(!Date.parse(this.formData.pubblicatoDopoIl)){        
        this.errors.push['Il campo pubblicato Dopo il deve avere il formato gg/mm/aaaa'];
      }
    }
    return this.errors.length == 0;
  }

  pulisci(){
    this.formData = {
      "limit" : 20,
      "offset" : 0,
      "regioneSA": environment.defaultRegione,
      "provinciaSA": "",
      "stazioneAppaltante": "",
      "codiceFiscaleSA": "",
      "anno": "",
      "tipoProg": "",
      "pubblicatoPrimaDel":"",
      "pubblicatoDopoIl":"",
      'sysconSA':environment.defaultSyscon
    };
    SessionUtil.putObjectInSession(Constants.programmiFormData, this.formData);
  }

  formatDateToPicker(date){    
    const dateArray = date.split('/');
    const day = dateArray[0];
    const year = dateArray[2];
    const month = dateArray[1];
    return year + '-' + month + '-' + day; 
} 

public saNames: any[];
public saCfs: any[];

  filterNameSA(event,searchWord :string) {     
    let saNames=[];
    TabellatiUtil.getSADenominazione(searchWord).subscribe(name => {
      name.data.forEach(element => {       
        saNames.push(element.saNomein);
      });          
      this.saNames = saNames;   
    });          
  }
  
  filterCfSA(event,searchWord :string) {     
    let saCfs=[];
    TabellatiUtil.getSACodFisc(searchWord).subscribe(name => {
      name.data.forEach(element => {
        saCfs.push(element.saCFein);
      });     
      this.saCfs = saCfs;         
    });              
  }
 
}
