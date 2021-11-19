import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BandiService } from '../../../shared/services/bandi-service.service';
import { Constants } from '../../../shared/utils/constants';
import { TabellatiUtil } from '../../../shared/utils/tabellati-utils';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { SessionUtil } from 'src/app/shared/utils/session-util';

@Component({
  selector: 'app-dettaglio-avviso',
  templateUrl: './dettaglio-avviso.component.html',
  styleUrls: ['./dettaglio-avviso.component.css']
})
export class DettaglioAvvisoComponent implements OnInit {
  
  isDataReady: boolean = false;
  detailData = {
    id:''
  };
  error = false;
  formData : any;
  constructor( private route: ActivatedRoute,
    private router: Router, private BandiService: BandiService,
    private sanitizer:DomSanitizer) { }

  ngOnInit() {
    this.route
      .queryParams
      .subscribe(params => {
        this.error = false;
        this.BandiService.dettaglioAvviso(params.id, params.codiceSA, params.codiceSistema, this)
          .subscribe(avviso => {
            avviso.documenti.forEach ( doc => {
              if(doc.url == null){
                let url = environment.bandiServiceUrl;
                doc.url = `${url}/Avvisi/Documento?id=${doc.id}&codiceSA=${doc.codiceSA}&codiceSistema=${doc.codiceSistema}&nrDoc=${doc.nrDoc}`;
              }
            });
            this.detailData = avviso;
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
            
            TabellatiUtil.initializeTabellatiBandi(this, TabellatiUtil.initializeTabellatiDettaglioAvvisi);
        });
      });
  }

  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  indietro(){
    
    this.router.navigate(['/', Constants.bandiPath, Constants.listaAvvisiPath]);

  }

}