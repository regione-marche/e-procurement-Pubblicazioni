import { SessionUtil } from "./session-util";
import { Constants } from "./constants";
import { TabellatiService } from "../services/tabellati.service";
import { environment } from "src/environments/environment";


export class TabellatiUtil {

    static initializeTabellatiProgrammi(object){

        let regioni = SessionUtil.getObjectFromSession(Constants.regioniData);
        let regioniProvinceMap = SessionUtil.getObjectFromSession(Constants.regioniProvinceMap);
        let tipiProg = SessionUtil.getObjectFromSession(Constants.tipiProgramma);
        if(regioni != null && regioniProvinceMap != null && tipiProg != null){
            object.listaRegioni = regioni;
            object.listaProvince = this.getProvinciaByRegione(object.formData.regioneSA);
            object.tipiProg = tipiProg;
            object.isDataReady = true;
        } else {
            TabellatiService.listaRegioni()
                .subscribe(regioni => {
                SessionUtil.putObjectInSession(Constants.regioniData, regioni.data);   
                object.listaRegioni = regioni.data;                               
                TabellatiService.listaProvince()
                    .subscribe(province => {
                    SessionUtil.putObjectInSession(Constants.provinceData, province.data);
                    let provinceMap = {};
                    province.data.forEach(provincia => {
                        provinceMap[provincia.code] = provincia.value;
                    });
                    this.populateRegioniProvince(province);
                    SessionUtil.putObjectInSession(Constants.provinceMaps, provinceMap); 
                    object.listaProvince = this.getProvinciaByRegione(object.formData.regioneSA);
                    TabellatiService.listaValori('TipoProgramma')
                        .subscribe(tipiProgramma => {
                        SessionUtil.putObjectInSession(Constants.tipiProgramma, tipiProgramma.data);
                        let tipiProgrammaMap = {};
                        tipiProgramma.data.forEach(tipoProgramma => {
                            tipiProgrammaMap[tipiProgramma.code] = tipiProgramma.value;
                        }); 
                        SessionUtil.putObjectInSession(Constants.tipiProgrammaMap, tipiProgrammaMap);
                        object.tipiProg = tipiProgramma.data;
                        object.isDataReady = true;
                    });
                });             
            });
        }
    }


    static initializeTabellatiBandi(object, functionParam){
        let regioni = SessionUtil.getObjectFromSession(Constants.regioniData);
        let regioniProvinceMap = SessionUtil.getObjectFromSession(Constants.regioniProvinceMap);
        let stati = SessionUtil.getObjectFromSession(Constants.statoData);
        let tipiAppalto = SessionUtil.getObjectFromSession(Constants.tipiAppaltoData);
        let tipiAppaltoMap = SessionUtil.getObjectFromSession(Constants.tipiAppaltoMap); 
        let categorie = SessionUtil.getObjectFromSession(Constants.categorieData);
        let atti = SessionUtil.getObjectFromSession(Constants.attiData);
        let scelteContraenti = SessionUtil.getObjectFromSession(Constants.scelteContraentiData);
        let tipiAvvisoMaps = SessionUtil.getObjectFromSession(Constants.tipiAvvisoMaps);
        

        if(regioni != null && regioniProvinceMap != null && stati != null && tipiAppalto != null && categorie != null && atti !=null && scelteContraenti != null && tipiAppaltoMap != null && tipiAvvisoMaps !=null){
            object.listaRegioni = regioni;
            object.listaProvince = this.getProvinciaByRegione(object.formData.regioneSA);
            object.listaStati = stati;
            object.listaTipiAppalto = tipiAppalto;
            object.listaCategorie = categorie;
            object.atti = atti;
            object.listaScelteContraenti = scelteContraenti;
            object.isDataReady = true;
        } else {
            TabellatiService.listaRegioni()
                .subscribe(regioni => {
                SessionUtil.putObjectInSession(Constants.regioniData, regioni.data);
                
                object.listaRegioni = regioni.data;                               
                TabellatiService.listaProvince()
                    .subscribe(province => {
                    SessionUtil.putObjectInSession(Constants.provinceData, province.data);
                    let provinceMap = {};
                    province.data.forEach(provincia => {
                        provinceMap[provincia.code] = provincia.value;
                    });
                    this.populateRegioniProvince(province); 
                    SessionUtil.putObjectInSession(Constants.provinceMaps, provinceMap); 
                    object.listaProvince = this.getProvinciaByRegione(object.formData.regioneSA);
                    TabellatiService.listaValori('Stato')
                       .subscribe(stato => {
                        if(environment.statoBandiCompleto){
                            stato.data=[{code: "1", value: "In Corso"},                                    
                                    {code: "4", value: "Scaduti - In Aggiudicazione"},
                                    {code: "5", value: "Scaduti - Aggiudicati"},
                                    {code: "3", value: "tutti"}] 
                        }else{
                            stato.data=[{code: "1", value: "In Corso"},                                    
                                    {code: "2", value: "Scaduti"},
                                    {code: "3", value: "tutti"}] 
                        }
                                               

                        SessionUtil.putObjectInSession(Constants.statoData, stato.data);                
                        object.listaStati = stato.data;
                        TabellatiService.listaValori('TipoAppalto')
                            .subscribe(tipiAppalto => {
                            SessionUtil.putObjectInSession(Constants.tipiAppaltoData, tipiAppalto.data);                
                            object.listaTipiAppalto = tipiAppalto.data;
                            let tipiAppaltoMap = {};
                            tipiAppalto.data.forEach(tipiAppaltoElement => {
                                tipiAppaltoMap[tipiAppaltoElement.code] = tipiAppaltoElement.value;
                            }); 
                            SessionUtil.putObjectInSession(Constants.tipiAppaltoMap, tipiAppaltoMap); 
                            TabellatiService.listaValori('Categorie')
                                .subscribe(categorie => {
                                SessionUtil.putObjectInSession(Constants.categorieData, categorie.data);                
                                object.listaCategorie = categorie.data;
                                TabellatiService.listaValori('TipoAvviso')
                                    .subscribe(tipiAvviso => {
                                    let tipiAvvisoMap = {};
                                    tipiAvviso.data.forEach(tipoAvviso => {
                                        tipiAvvisoMap[tipoAvviso.code] = tipoAvviso.value;
                                    }); 
                                    SessionUtil.putObjectInSession(Constants.tipiAvvisoMaps, tipiAvvisoMap);
                                    TabellatiService.listaAtti()
                                        .subscribe(atti => {
                                        object.atti = atti.data;
                                        SessionUtil.putObjectInSession(Constants.attiData, atti.data);
                                        TabellatiService.listaValori('SceltaContraente')
                                        .subscribe(scelteContraenti => {
                                            SessionUtil.putObjectInSession(Constants.tipiAvvisoMaps, tipiAvvisoMap);
                                            object.listaScelteContraenti = scelteContraenti.data; 
                                            if(functionParam == null){
                                                object.isDataReady = true;
                                            }
                                            else {
                                                functionParam(object);
                                            }
                                        });
                                    });
                                });
                            });
                        });
                    });
                });             
            });
        }
    }

    static populateRegioniProvince(province){
        let regioniProvinceMap = {};
        province.data.forEach(provincia => {
            if(regioniProvinceMap[provincia.codistat] != null){
                regioniProvinceMap[provincia.codistat].push(provincia);
            } else {
                regioniProvinceMap[provincia.codistat] = [provincia];
            }             
        });
        SessionUtil.putObjectInSession(Constants.regioniProvinceMap, regioniProvinceMap);
    }

    static getProvinciaByRegione(regioneCode){
        if(regioneCode == ""){
            return SessionUtil.getObjectFromSession(Constants.provinceData);
        }
        else {
            regioneCode = regioneCode.substring(1);
        }  
        return SessionUtil.getObjectFromSession(Constants.regioniProvinceMap)[regioneCode];
    }

    static getProvinciaValue(provinciaCode){
        return SessionUtil.getObjectFromSession(Constants.provinceMaps)[provinciaCode];
    }

    static getTipoAvvisoValue(tipoAvvisoCode){
        let a = SessionUtil.getObjectFromSession(Constants.tipiAvvisoMaps);
        return SessionUtil.getObjectFromSession(Constants.tipiAvvisoMaps)[tipoAvvisoCode];
    }

    static initializeTabellatiDettaglioBandi(object){
        let procedure = SessionUtil.getObjectFromSession(Constants.procedureMap);
        let criteriAggiudicazione = SessionUtil.getObjectFromSession(Constants.criteriAggiudicazioneMap);
        let settori = SessionUtil.getObjectFromSession(Constants.settoriMap);
        let tipiRealizzazione =  SessionUtil.getObjectFromSession(Constants.tipiRealizzazioneMap);
        let tipoDocumentoMap = SessionUtil.getObjectFromSession(Constants.tipoDocumentoMap);

        if(procedure != null && criteriAggiudicazione != null && settori != null && tipiRealizzazione!=null){
            TabellatiUtil.formatDataDetailBandi(object)
        } else {
            TabellatiService.listaValori('SceltaContraente50')
                .subscribe(TipologiaProcedura => {
                let TipologiaProceduraMap = {};
                TipologiaProcedura.data.forEach(tipoProc => {
                    TipologiaProceduraMap[tipoProc.code] = tipoProc.value;
                }); 
                SessionUtil.putObjectInSession(Constants.procedureMap, TipologiaProceduraMap);
                    TabellatiService.listaValori('CriterioAggiudicazione')
                        .subscribe(CriterioAggiudicazione => {
                        let CriterioAggiudicazioneMap = {};
                        CriterioAggiudicazione.data.forEach(criterio => {
                            CriterioAggiudicazioneMap[criterio.code] = criterio.value;
                        }); 
                        SessionUtil.putObjectInSession(Constants.criteriAggiudicazioneMap, CriterioAggiudicazioneMap);
                        TabellatiService.listaValori('Settore')
                            .subscribe(Settori => {
                            let settoriMap = {};
                            Settori.data.forEach(settore => {
                                settoriMap[settore.code] = settore.value;
                            }); 
                            SessionUtil.putObjectInSession(Constants.settoriMap, settoriMap);

                            TabellatiService.listaValori('TipoRealizzazione')
                            .subscribe(tipiRealizzazione => {
                            let tipiRealizzazioneMap = {};
                            tipiRealizzazione.data.forEach(tipoRealizzazione => {
                                tipiRealizzazioneMap[tipoRealizzazione.code] = tipoRealizzazione.value;
                            }); 
                            SessionUtil.putObjectInSession(Constants.tipiRealizzazioneMap, tipiRealizzazioneMap);

                                TabellatiService.listaAtti()
                                .subscribe(tipiDocumento => {
                                let tipiDocumentoMap = {};
                                tipiDocumento.data.forEach(tipoDocumento => {
                                    tipiDocumentoMap[tipoDocumento.code] = tipoDocumento.value;
                                }); 
                                SessionUtil.putObjectInSession(Constants.tipoDocumentoMap, tipiDocumentoMap);
                                TabellatiUtil.formatDataDetailBandi(object)
                            });                            
                        });
                    });
                       
                });
                
            });
        }
    }

    static initializeTabellatiDettaglioEsiti(object){
        let procedure = SessionUtil.getObjectFromSession(Constants.procedureMap);
        let criteriAggiudicazione = SessionUtil.getObjectFromSession(Constants.criteriAggiudicazioneMap);
        let settori = SessionUtil.getObjectFromSession(Constants.settoriMap);
        let realizzazioneMap =  SessionUtil.getObjectFromSession(Constants.realizzazioniMap);
        let tipoDocumentoMap = SessionUtil.getObjectFromSession(Constants.tipoDocumentoMap);
        if(procedure != null && criteriAggiudicazione != null && settori != null && realizzazioneMap != null && tipoDocumentoMap!=null){
            TabellatiUtil.formatDataDetailEsiti(object)
        } else {

            TabellatiService.listaValori('SceltaContraente50')
            .subscribe(TipologiaProcedura => {
            let TipologiaProceduraMap = {};
            TipologiaProcedura.data.forEach(tipoProc => {
                TipologiaProceduraMap[tipoProc.code] = tipoProc.value;
            }); 
            SessionUtil.putObjectInSession(Constants.procedureMap, TipologiaProceduraMap);
                TabellatiService.listaValori('CriterioAggiudicazione')
                    .subscribe(CriterioAggiudicazione => {
                    let CriterioAggiudicazioneMap = {};
                    CriterioAggiudicazione.data.forEach(criterio => {
                        CriterioAggiudicazioneMap[criterio.code] = criterio.value;
                    }); 
                    SessionUtil.putObjectInSession(Constants.criteriAggiudicazioneMap, CriterioAggiudicazioneMap);
                    TabellatiService.listaValori('Settore')
                        .subscribe(Settori => {
                        let settoriMap = {};
                        Settori.data.forEach(settore => {
                            settoriMap[settore.code] = settore.value;
                        }); 
                        SessionUtil.putObjectInSession(Constants.settoriMap, settoriMap);
                        TabellatiService.listaValori('Settore')
                        .subscribe(Settori => {
                        let settoriMap = {};
                        Settori.data.forEach(settore => {
                            settoriMap[settore.code] = settore.value;
                        }); 
                        SessionUtil.putObjectInSession(Constants.settoriMap, settoriMap);
                            TabellatiService.listaValori('TipoRealizzazione')
                                .subscribe(tipiRealizzazione => {
                                let tipiRealizzazioneMap = {};
                                tipiRealizzazione.data.forEach(tipoRealizzazione => {
                                    tipiRealizzazioneMap[tipoRealizzazione.code] = tipoRealizzazione.value;
                                }); 
                                SessionUtil.putObjectInSession(Constants.realizzazioniMap, tipiRealizzazioneMap);


                                TabellatiService.listaAtti()
                                    .subscribe(tipiDocumento => {
                                    let tipiDocumentoMap = {};
                                    tipiDocumento.data.forEach(tipoDocumento => {
                                        tipiDocumentoMap[tipoDocumento.code] = tipoDocumento.value;
                                    }); 
                                    SessionUtil.putObjectInSession(Constants.tipoDocumentoMap, tipiDocumentoMap);
                                    TabellatiUtil.formatDataDetailEsiti(object)
                                });
                        });
                    });                      
                       
                });
                   
            });
            
        });
        }      
    }


    static initializeTabellatiDettaglioAvvisi(object){
        let tipiAvvisoMap =  SessionUtil.getObjectFromSession(Constants.tipiAvvisoMaps);
        object.detailData.tipologia = tipiAvvisoMap[object.tipologia];
        let pubblicazioni = object.detailData.pubblicazioni;
        let listaPubblicazioni = [];
        if(pubblicazioni != null){
            if(pubblicazioni.length > 1){
                listaPubblicazioni[0] = 'Trasmesso il ' + pubblicazioni[pubblicazioni.length -1 ].data;
                listaPubblicazioni[1] = 'Ultimo aggiornamento in data ' +  pubblicazioni[0].data;
            } else {
                listaPubblicazioni[0] = 'Trasmesso il ' + pubblicazioni[0].data;                        
            }
        }
        object.detailData.pubblicazioni = listaPubblicazioni;


        object.isDataReady = true;
    }

    static formatDataDetailBandi(object){
        let lotti =  object.detailData.lotti;
        let atti = object.detailData.atti;
        let tipiAppaltoMap = SessionUtil.getObjectFromSession(Constants.tipiAppaltoMap);
        let procedureMap = SessionUtil.getObjectFromSession(Constants.procedureMap);
        let criteriAggiudicazioneMap = SessionUtil.getObjectFromSession(Constants.criteriAggiudicazioneMap);
        let settoriMap = SessionUtil.getObjectFromSession(Constants.settoriMap);
        let tipiRealizzazioneMap = SessionUtil.getObjectFromSession(Constants.tipiRealizzazioneMap);
        let tipoDocumentoMap = SessionUtil.getObjectFromSession(Constants.tipoDocumentoMap);
        object.detailData.settore = settoriMap[object.detailData.settore];
        object.detailData.realizzazione = tipiRealizzazioneMap[object.detailData.realizzazione];
        let importoTotale = 0;
        if(lotti != null){
            if(lotti.length == 1){
                object.visualizzaLotti = true;
            }
            lotti.forEach(lotto => {
                lotto.tipoAppalto = tipiAppaltoMap[lotto.tipoAppalto];
                lotto.tipoProcedura = procedureMap[lotto.tipoProcedura];
                lotto.criterioAggiudicazione = criteriAggiudicazioneMap[lotto.criterioAggiudicazione];
                importoTotale += lotto.importoLotto;
            });
        }

        object.detailData.importoTotale = importoTotale;
        if(atti != null){
            atti.forEach(atto => {
                
                let pubblicazioni = atto.pubblicazioni;
                let aggiudicatari = atto.aggiudicatari;
                let listaPubblicazioni = [];
                if(pubblicazioni != null){
                    if(pubblicazioni.length > 1){
                        listaPubblicazioni[0] = 'Trasmesso il ' + pubblicazioni[pubblicazioni.length -1 ].data;
                        listaPubblicazioni[1] = 'Ultimo aggiornamento in data ' + pubblicazioni[0].data;
                    } else {
                        listaPubblicazioni[0] = 'Trasmesso il ' + pubblicazioni[0].data;                        
                    }
                }
                atto.pubblicazioni = listaPubblicazioni;           
                atto.descrizione=tipoDocumentoMap[atto.tipoDocumento];
                atto.titolo=tipoDocumentoMap[atto.tipoDocumento];
                aggiudicatari.forEach(aggiudicatario => {
                    let ruolo = aggiudicatario.ruolo;
                    if(aggiudicatari.length == 1){
                        aggiudicatario.ruolo = ''
                    } else {

                        if(ruolo == 1){
                            aggiudicatario.ruolo = '(Mandataria)';
                        } else {
                            aggiudicatario.ruolo = '(Mandante)';
                        }
                    }
                });

                atto.documenti.forEach(doc => {
                   if(doc.url == null){
                    if(doc.url == null){
                        let url = environment.bandiServiceUrl;
                        doc.url = `${url}/Bandi/Documento?id=${doc.id}&numeroPubblicazione=${doc.numeroPubblicazione}&nrDoc=${doc.nrDoc}`;
                      }
                   }
                });

            });
        }
        object.isDataReady = true;
    }
    
    static formatDataDetailEsiti(object){
        let lotti =  object.detailData.lotti;
        let atti = object.detailData.atti;
        let tipiAppaltoMap = SessionUtil.getObjectFromSession(Constants.tipiAppaltoMap);
        let procedureMap = SessionUtil.getObjectFromSession(Constants.procedureMap);
        let criteriAggiudicazioneMap = SessionUtil.getObjectFromSession(Constants.criteriAggiudicazioneMap);
        let settoriMap = SessionUtil.getObjectFromSession(Constants.settoriMap);
        let realizzazioneMap = SessionUtil.getObjectFromSession(Constants.realizzazioniMap);
        let tipoDocumentoMap = SessionUtil.getObjectFromSession(Constants.tipoDocumentoMap);
        object.detailData.settore = settoriMap[object.detailData.settore];
        let importoTotale = 0;
        if(lotti != null){
            if(lotti.length == 1){
                object.visualizzaLotti = true;
            }
            lotti.forEach(lotto => {
                lotto.tipoAppalto = tipiAppaltoMap[lotto.tipoAppalto];
                lotto.tipoProcedura = procedureMap[lotto.tipoProcedura];
                lotto.criterioAggiudicazione = criteriAggiudicazioneMap[lotto.criterioAggiudicazione];
                importoTotale += lotto.importoLotto;
            });
        }
        object.detailData.importoTotale = importoTotale;
        object.detailData.realizzazione = realizzazioneMap[object.realizzazione];
        object.detailData.esito.tipoDocumento = tipoDocumentoMap[ object.detailData.esito.tipoDocumento];
        
        let pubblicazioni = object.detailData.esito.pubblicazioni;
        let listaPubblicazioni = [];
        if(pubblicazioni != null){
            if(pubblicazioni.length > 1){
                listaPubblicazioni[0] = 'Trasmesso il ' + pubblicazioni[pubblicazioni.length -1 ].data;
                listaPubblicazioni[1] = 'Ultimo aggiornamento in data ' + pubblicazioni[0].data;
            } else {
                listaPubblicazioni[0] = 'Trasmesso il ' + pubblicazioni[0].data;                        
            }
        }
        object.detailData.esito.pubblicazioni = listaPubblicazioni;
        let aggiudicatari = object.detailData.esito.aggiudicatari;
        if(aggiudicatari != null){
            aggiudicatari.forEach(aggiudicatario => {
                let ruolo = aggiudicatario.ruolo;
                if(aggiudicatari.length == 1){
                    aggiudicatario.ruolo = ''
                } else {

                    if(ruolo == 1){
                        aggiudicatario.ruolo = '(Mandataria)';
                    } else {
                        aggiudicatario.ruolo = '(Mandante)';
                    }
                }
            });
        }
        object.detailData.esito.documenti.forEach(doc => {

            if(doc.url == null){
                let url = environment.bandiServiceUrl;
                doc.url = `${url}/Bandi/Documento?id=${doc.id}&numeroPubblicazione=${doc.numeroPubblicazione}&nrDoc=${doc.nrDoc}`;
            }

         });


        object.isDataReady = true;
    }

    static getSADenominazione(saName: string){
        return TabellatiService.getSADenominazione(saName);
    }

    static getSACodFisc(saCF: string){
        return TabellatiService.getSACodFisc(saCF);
    }

    static getTestoStorico(arrayStorico) {

        let storicoData = "DENOMINAZIONE - DATA SCADENZA\n";
        arrayStorico.forEach(storico => {
            storicoData += storico.denominazione + " - " + storico.dataFineValidita + "\n";
        });
		
		return storicoData;
	}
 }
