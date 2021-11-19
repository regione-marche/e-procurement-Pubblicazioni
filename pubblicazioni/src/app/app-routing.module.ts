import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule} from '@angular/router';
import { BandiComponent } from './pages/bandi/bandi.component';
import { RicercaBandiComponent } from './pages/bandi/ricerca-bandi/ricerca-bandi.component';
import { ProgrammiComponent } from './pages/programmi/programmi.component';
import { RicercaProgrammiComponent } from './pages/programmi/ricerca-programmi/ricerca-programmi.component';
import { ListaProgrammiComponent } from './pages/programmi/lista-programmi/lista-programmi.component';
import { DettaglioProgrammaComponent } from './pages/programmi/dettaglio-programma/dettaglio-programma.component';
import { Constants } from './shared/utils/constants';
import { ListaBandiComponent } from './pages/bandi/lista-bandi/lista-bandi.component';
import { ListaEsitiComponent } from './pages/bandi/lista-esiti/lista-esiti.component';
import { ListaAvvisiComponent } from './pages/bandi/lista-avvisi/lista-avvisi.component';
import { DettaglioAvvisoComponent } from './pages/bandi/dettaglio-avviso/dettaglio-avviso.component';
import { DettaglioBandoComponent } from './pages/bandi/dettaglio-bando/dettaglio-bando.component';
import { DettaglioEsitoComponent } from './pages/bandi/dettaglio-esito/dettaglio-esito.component';
import { ListaAttiComponent } from './pages/bandi/lista-atti/lista-atti.component';
import { DettaglioAttoComponent } from './pages/bandi/dettaglio-atto/dettaglio-atto.component';
import { HomeComponent } from './pages/home/home.component';


const routes: Routes = [
  {path: Constants.rootPath, component: HomeComponent, pathMatch: 'full'},
  {path: Constants.bandiPath, component: BandiComponent,children:[
    {path: Constants.ricercaPath, component: RicercaBandiComponent, data: {
      breadcrumb: 'Bandi, avvisi ed esiti di gara > Ricerca'
    }},
    {path: Constants.listaBandiPath, component: ListaBandiComponent, data: {
      breadcrumb: 'Bandi, avvisi ed esiti di gara > Lista bandi'
    }},
    {path: Constants.listaEsitiPath, component: ListaEsitiComponent, data: {
      breadcrumb: 'Bandi, avvisi ed esiti di gara > Lista esiti'
    }},
    {path: Constants.listaAvvisiPath, component: ListaAvvisiComponent, data: {
      breadcrumb: 'Bandi, avvisi ed esiti di gara > Lista avvisi'
    }},
    {path: Constants.listaAttiPath, component: ListaAttiComponent, data: {
      breadcrumb: 'Bandi, avvisi ed esiti di gara > Lista atti'
    }},
    

    {path: Constants.dettaglioAvvisiPath, component: DettaglioAvvisoComponent, data: {
      breadcrumb: 'Bandi, avvisi ed esiti di gara > Dettaglio avviso'
    }},
    {path: Constants.dettaglioBandiPath, component: DettaglioBandoComponent, data: {
      breadcrumb: 'Bandi, avvisi ed esiti di gara > Dettaglio bando'
    }},
    {path: Constants.dettaglioEsitiPath, component: DettaglioEsitoComponent, data: {
      breadcrumb: 'Bandi, avvisi ed esiti di gara > Dettaglio esito'
    }},
    {path: Constants.dettaglioattiPath, component: DettaglioAttoComponent, data: {
      breadcrumb: 'Bandi, avvisi ed esiti di gara > Dettaglio atto'
    }},
    
    
  ]},
  {path: Constants.programmiPath, component: ProgrammiComponent, children:[
    {path: Constants.ricercaPath, component: RicercaProgrammiComponent, data: {
      breadcrumb: 'Programmazione lavori, beni e servizi > Ricerca Programmi'
    }},
    {path: Constants.listaPath, component: ListaProgrammiComponent, data: {
      breadcrumb: 'Programmazione lavori, beni e servizi > Lista Programmi'
    }},
    {path: Constants.dettaglioPath, component: DettaglioProgrammaComponent, data: {
      breadcrumb: 'Programmazione lavori, beni e servizi > Dettaglio Programmi'
    }}
  ]},
  {path: Constants.otherPaths, redirectTo: ''}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }