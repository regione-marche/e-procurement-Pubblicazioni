import { Component, OnInit, SecurityContext } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgrammiService } from '../../../shared/services/programmi-service.service';
import { Constants } from '../../../shared/utils/constants';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-dettaglio-programma',
  templateUrl: './dettaglio-programma.component.html',
  styleUrls: ['./dettaglio-programma.component.css']
})
export class DettaglioProgrammaComponent implements OnInit {

  isDataReady: boolean = false;
  detailData = {
    id:'',
    adozione: null,
    approvazione : null
  };
  docData = {};
  error = false;

  constructor( private route: ActivatedRoute,
    private router: Router, private ProgrammiService: ProgrammiService,
    private sanitizer:DomSanitizer) { }

  ngOnInit() {
    this.route
      .queryParams
      .subscribe(params => {
        this.error = false;
        this.ProgrammiService.dettaglio(params.id, this)
          .subscribe(programma => {
            this.detailData = programma;
            console.log(programma);
            this.isDataReady = true;
        });
      });
  }

  scaricaDoc(type){
    this.ProgrammiService.documento(type, this.detailData.id)
    .subscribe(blob => {
      
      let filename = 'programma_'+this.detailData.id;
      if(type == "Pdf"){
        filename += '.pdf';
      } else {
        filename += '.xml';
      }
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
      } else {
        const downloadLink = document.createElement("a");
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.setAttribute("href", window.URL.createObjectURL(blob));
        downloadLink.setAttribute("download", filename);
        downloadLink.click();
        document.body.removeChild(downloadLink);
     }
       
    });
  }

  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  indietro(){
    
    this.router.navigate(['/', Constants.programmiPath, Constants.listaPath]);

  }
}
