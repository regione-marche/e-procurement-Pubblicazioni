import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterContentInit } from '@angular/core';
import { SessionUtil } from '../../../shared/utils/session-util';
import { BandiService } from '../../../shared/services/bandi-service.service';
import { Router } from '@angular/router';
import { Constants } from '../../../shared/utils/constants';
import { TabellatiUtil } from '../../../shared/utils/tabellati-utils';
import { environment } from 'src/environments/environment';
import { TabellatiService } from 'src/app/shared/services/tabellati.service';

@Component({
  selector: 'app-ricerca-bandi',
  templateUrl: './ricerca-bandi.component.html',
  styleUrls: ['./ricerca-bandi.component.css']
})
export class RicercaBandiComponent implements OnInit
{


  formData : any = {
    'limit' : 20,
    'offset' : 0,
    'ricercaIn': '1',
    'stato' : '1',
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
    'codiceFiscaleSA':'',
    'codiceCpv' : '',
    'oggetto' : '',
    'cig' : '',
    'tipoAtto':'',
    'sysconSA':environment.defaultSyscon,
    'sceltaContr':''
  };


  public saNames: any[];
  public saCfs: any[];


  filterNameSA2(event,searchWord :string) {     
    this.saNames=["aaa","bbb","ccc"]; 
          
  }
 


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


  nodes = [
    {
      code: '0',
      value: 'CPV del vocabolario principale',
      displayField: 'CPV del vocabolario principale'
    }
  ];
  options = {
    displayField: 'displayField',
    idField: 'code'
  };

  errors = [];

  isDataReady:boolean = false;

  listaRegioni = [];

  listaProvince = [];

  listaStati = [];

  listaTipiAppalto = [];

  listaCategorie = [];
  
  listaBandi: any = {};

  listaScelteContraenti: any = [];

  atti = [];

  session : SessionUtil;

  filtriRegione: boolean = environment.filtriRegione;

  filtriProvincia: boolean = environment.filtriProvincia; 

  hasAtti: boolean = environment.atti;

  filtroCfEnte: boolean = environment.cfEnte;

  profiloCommittente = environment.profiloCommittente;

  testoBaloon : string = '';

  testoBaloonMap = {};

  minDateFilter = '';

  @ViewChild('importoRow' ) importoRow :ElementRef;
  @ViewChild('categoriaRow')  categoriaRow :ElementRef;
  @ViewChild('tipologiaRow')  tipologiaRow:ElementRef;
  @ViewChild('tipoAppaltoRow')  tipoAppaltoRow:ElementRef;
  @ViewChild('statoRow') statoRow :ElementRef;
  @ViewChild('tipiAttoRow')  tipiAttoRow :ElementRef;
  @ViewChild('sceltaContraente')  sceltaContraente :ElementRef;

  constructor(
    private BandiService: BandiService,
    private router: Router) { 

  }

  ngOnInit() {
    
    this.testoBaloonMap["0"]= "Pubblicità di avvisi di preinformazione, inviti e manifestazioni di interesse, elenchi operatori economici, avvisi di indizione gare, ecc."; 
    this.testoBaloonMap["1"]= "Bandi di gara per la pubblicità di procedure di selezione del contraente sopra e sotto soglia comunitaria.";
    this.testoBaloonMap["2"]= "Esiti di procedure di selezione del contraente per: contratti, accordi quadro e convenzioni, esiti negativi, esiti di procedure annullate.";
    this.testoBaloonMap["3"]= "Atti ex art. 29 c.1 d.lgs 50/2016 e s.m.i.";
    this.testoBaloon = this.testoBaloonMap[this.formData.ricercaIn];

    this.minDateFilter = this.formatDateToPicker(environment.minPublishDate);

 //   if(SessionUtil.getObjectFromSession(Constants.bandiFormData) != null){     
 //     this.formData = SessionUtil.getObjectFromSession(Constants.bandiFormData);  
        
 //   }
    TabellatiUtil.initializeTabellatiBandi(this, null);
  }


  onTreeInitialize(event){
    this.expandTreeNode(event.treeModel.getFirstRoot(), event.treeModel);
  }

  onNodeExpanded(event){
    this.expandTreeNode(event.node, event.treeModel);
  }

  expandTreeNode(node, treeModel){
    let code = node.data.code;
    if(code != '0'){
      this.formData.codiceCpv = code;
    }
      
    if(node.data.children != null){
      
      return;
    }

   
    let livello = code.length / 2; 

    let cods = [];
    for(let i = 0; i < livello; i++) {
      cods[i] = code.substring(i * 2, i * 2 + 2);
    }

    this.BandiService.getCpv(cods)
      .subscribe(treeLevel => {        
        treeLevel.data.forEach(element => {
          if(code!="0"){
            element.code = code + element.code; 
          }
          element.displayField = element.code + ' - ' + element.value;
        });
        if(treeLevel.data.length > 0){
          node.data.children = treeLevel.data;
          treeModel.update();
        }
    });
  }


  cerca(){
    
    if(this.validate()){
      this.formData.offset = 0;
      if(this.formData.ricercaIn == "1"){
        this.router.navigate(['/', Constants.bandiPath, Constants.listaBandiPath]);
      } else if( this.formData.ricercaIn == "0"){
        this.router.navigate(['/', Constants.bandiPath, Constants.listaAvvisiPath]);
      } else if( this.formData.ricercaIn == "2"){
        this.router.navigate(['/', Constants.bandiPath, Constants.listaEsitiPath]);
      } else {
        this.router.navigate(['/', Constants.bandiPath, Constants.listaAttiPath]);
      }
    }
  }

  setRicercaIn(value){
    this.formData.ricercaIn = value;
  
    

    if(value === '2' || value === '1' || value === '3'){
      if( value === '3' || value === '2'){
        this.statoRow.nativeElement.style.display = "none";
      } else {
        this.statoRow.nativeElement.style.display = "flex";
      }
      this.categoriaRow.nativeElement.style.display = "flex";
      this.tipologiaRow.nativeElement.style.display = "flex";
      this.tipoAppaltoRow.nativeElement.style.display = "flex";
      this.importoRow.nativeElement.style.display = "flex";
      this.sceltaContraente.nativeElement.style.display="flex";
    } else {
      this.statoRow.nativeElement.style.display = "flex";
      this.categoriaRow.nativeElement.style.display = "none";
      this.tipologiaRow.nativeElement.style.display = "none";
      this.tipoAppaltoRow.nativeElement.style.display = "none";
      this.importoRow.nativeElement.style.display = "none";
      this.sceltaContraente.nativeElement.style.display="none";
    }
    if(value === '3' && this.tipiAttoRow != null){
      this.tipiAttoRow.nativeElement.style.display = "flex";
    } else if(this.tipiAttoRow != null){
      this.tipiAttoRow.nativeElement.style.display = "none";
    }
    this.testoBaloon = this.testoBaloonMap[value];
  }

  pulisci(){
    this.formData = {
      'limit' : 20,
      'offset' : 0,
      'stato' : '1',
      'ricercaIn': this.formData.ricercaIn,
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
    SessionUtil.putObjectInSession(Constants.bandiFormData, this.formData);
  }

  validate(){
    SessionUtil.putObjectInSession(Constants.bandiFormData, this.formData);
    this.errors = [];
    if(this.formData.pubblicatoPrimaDel != ''){
      if(Date.parse(this.formData.pubblicatoPrimaDel)){
        this.formData.pubblicatoPrimaDel = this.formatDate(this.formData.pubblicatoPrimaDel);
      } else {
        this.errors.push['Il campo pubblicato prima del deve avere il formato gg/mm/aaaa'];
      }
    }
    if(this.formData.pubblicatoDopoIl != ''){
      if(Date.parse(this.formData.pubblicatoDopoIl)){
        this.formData.pubblicatoDopoIl = this.formatDate(this.formData.pubblicatoDopoIl);
      } else {
        this.errors.push['Il campo data trasmissione (Dopo il) deve avere il formato gg/mm/aaaa'];
      }
    }
    if(this.formData.trasmessoPrimaDel != ''){
      if(Date.parse(this.formData.trasmessoPrimaDel)){
        this.formData.trasmessoPrimaDel = this.formatDate(this.formData.trasmessoPrimaDel);
      } else {
        this.errors.push['Il campo data trasmissione (prima del) deve avere il formato gg/mm/aaaa'];
      }

    }
    if(this.formData.trasmessoDopoIl != ''){
      if(Date.parse(this.formData.trasmessoDopoIl)){
        this.formData.trasmessoDopoIl = this.formatDate(this.formData.trasmessoDopoIl);
      } else {
        this.errors.push['Il campo data trasmissione (Dopo il) deve avere il formato gg/mm/aaaa'];
      }
    }


    return this.errors.length == 0;
  }

  updateProvince(){
    let regioneCode = this.formData.regioneSA;    
    this.listaProvince = TabellatiUtil.getProvinciaByRegione(regioneCode);
    this.formData.provinciaSA = '';
  }

  formatDate(date){    
      const dateArray = date.split('-');
      const year = dateArray[0];
      const day = dateArray[2].length === 1 ? '0' +  dateArray[2] :  dateArray[2];
      const month = dateArray[1].length === 1 ? '0' + dateArray[1] : dateArray[1];
      return day + '/' + month + '/' + year;
   
  }

  formatDateToPicker(date){    
    const dateArray = date.split('/');
    const day = dateArray[0];
    const year = dateArray[2];
    const month = dateArray[1];
    return year + '-' + month + '-' + day;
 
} 


}
