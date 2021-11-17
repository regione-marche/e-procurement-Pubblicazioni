import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ProgrammiComponent } from './pages/programmi/programmi.component';
import { BandiComponent } from './pages/bandi/bandi.component';
import { RicercaProgrammiComponent } from './pages/programmi/ricerca-programmi/ricerca-programmi.component';
import { ListaProgrammiComponent } from './pages/programmi/lista-programmi/lista-programmi.component';
import { DettaglioProgrammaComponent } from './pages/programmi/dettaglio-programma/dettaglio-programma.component';
import { RicercaBandiComponent } from './pages/bandi/ricerca-bandi/ricerca-bandi.component';
import { TreeModule } from 'angular-tree-component';
import { ListaBandiComponent } from './pages/bandi/lista-bandi/lista-bandi.component';
import { ListaEsitiComponent } from './pages/bandi/lista-esiti/lista-esiti.component';
import { ListaAvvisiComponent } from './pages/bandi/lista-avvisi/lista-avvisi.component';
import { DettaglioBandoComponent } from './pages/bandi/dettaglio-bando/dettaglio-bando.component';
import { DettaglioEsitoComponent } from './pages/bandi/dettaglio-esito/dettaglio-esito.component';
import { DettaglioAvvisoComponent } from './pages/bandi/dettaglio-avviso/dettaglio-avviso.component';
import {BreadcrumbsModule} from "ng6-breadcrumbs";
import { ListaAttiComponent } from './pages/bandi/lista-atti/lista-atti.component';
import { DettaglioAttoComponent } from './pages/bandi/dettaglio-atto/dettaglio-atto.component';
import { HomeComponent } from './pages/home/home.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
registerLocaleData(localeIt, 'it');



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ProgrammiComponent,
    BandiComponent,
    RicercaProgrammiComponent,
    ListaProgrammiComponent,
    DettaglioProgrammaComponent,
    RicercaBandiComponent,
    ListaBandiComponent,
    ListaEsitiComponent,
    ListaAvvisiComponent,
    ListaAttiComponent,
    DettaglioBandoComponent,
    DettaglioEsitoComponent,
    DettaglioAvvisoComponent,
    DettaglioAttoComponent,
    HomeComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    NgbModule,    
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BreadcrumbsModule,
    AutoCompleteModule,
    BrowserAnimationsModule,
    TreeModule.forRoot()
    

  ],
  providers: [{
    provide: LOCALE_ID,
    useValue: 'it-IT' // 'de-DE' for Germany, 'fr-FR' for France ...
  },
],
  bootstrap: [AppComponent]
})
export class AppModule { }
