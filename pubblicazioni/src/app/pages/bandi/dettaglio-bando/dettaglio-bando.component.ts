import { Component, OnInit } from '@angular/core';
import { BandiService } from '../../../shared/services/bandi-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from '../../../shared/utils/constants';
import { TabellatiUtil } from '../../../shared/utils/tabellati-utils';
import { DomSanitizer } from '@angular/platform-browser';
import { SessionUtil } from 'src/app/shared/utils/session-util';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dettaglio-bando',
  templateUrl: './dettaglio-bando.component.html',
  styleUrls: ['./dettaglio-bando.component.css']
})
export class DettaglioBandoComponent implements OnInit {
  
  isDataReady: boolean = false;
  visualizzaLotti: boolean = false;
  formData : any;
  detailData = {
    id:''
  };
  error =false;
  constructor( private route: ActivatedRoute,
    private router: Router, private BandiService: BandiService,
    private sanitizer:DomSanitizer) { }

  ngOnInit() {
    this.route
      .queryParams
      .subscribe(params => {
        this.error =false;
        this.BandiService.dettaglioBando(params.id, this)
          .subscribe(bando => {
            this.detailData = bando;
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

            TabellatiUtil.initializeTabellatiBandi(this, TabellatiUtil.initializeTabellatiDettaglioBandi);
        });
      });
  }

  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  indietro(){
    
    this.router.navigate(['/', Constants.bandiPath, Constants.listaBandiPath]);

  }

  enableVisualizzaLotti(){
    this.visualizzaLotti =true;
  }

}
