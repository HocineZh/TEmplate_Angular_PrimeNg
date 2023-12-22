import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConstant } from 'src/app/shared/constant';
import { Evenement } from '../models/evenement';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
  })

export class EvenementService {




    constructor(private http: HttpClient) { }


    //********************************************************************************************************************* */
    //************************************* Services évènements  ********************************************************* */

    getEvenements(evenementFilters:any,  paginator:any) : Observable<any> {
      let queryParams = new HttpParams();
      queryParams = queryParams.appendAll(evenementFilters);
      queryParams = queryParams.appendAll(paginator);

      return this.http.get<any>(
       environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'getAll',
       {params:queryParams}
      );
    }

    getEvenementById(idEvenement:any) : Observable<any> {


      return this.http.get<any>(
       environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'getById/'+idEvenement,
       httpOptions
      );
    }



   saveEvenement(newEvenement:any) : Observable<any> {

    //newEvenementPrv =JSON.stringify(newEvenementPrv);
      return this.http.post(
       environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'save',newEvenement,
        httpOptions
      );
    }

    updateEvenement(evenement:any) : Observable<any> {

      //newEvenementPrv =JSON.stringify(newEvenementPrv);
        return this.http.post(
         environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'update',evenement,
          httpOptions
        );
      }

    updateDateEvenement(id:any, evenementDates:any) : Observable<any> {

        let queryParams = new HttpParams();
        queryParams = queryParams.appendAll(evenementDates);

        //newEvenementPrv =JSON.stringify(newEvenementPrv);
          return this.http.get(
           environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'updateDates/'+ id,
           {params:queryParams}
          );
        }

    deleteEvenement(idEvenement:any, isPrevisionnel:boolean) : Observable<any> {
          return this.http.get(
           environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'delete/'+idEvenement +'/'+isPrevisionnel,
            httpOptions
          );
    }

    updateEtatEvenement(idEvenement:any,newEtat:any, motif:any ) : Observable<any> {
          return this.http.post(
           environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'updateEtat', {idEvenement : idEvenement, etat : newEtat , motif : motif},
            httpOptions
          );
    }

    publierEvenement(idEvenement:any, validationDate: boolean, delaisValidationDate: any, validationODJ: boolean, delaisValidationODJ: any) {
      return this.http.post(
        environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'publier',
        {idEvenement : idEvenement, validationDate : validationDate , delaisValidationDate : delaisValidationDate, validationODJ: validationODJ, delaisValidationODJ : delaisValidationODJ },
         httpOptions
       );
    }

    validerDateEvenement(idEvenement:any) : Observable<any> {
      return this.http.post(
       environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'validerDate',
       {idEvenement : idEvenement},
        httpOptions
      );
     }

     //**********************************************************************************************************************/
    //********************************* Services  membres ********************************************************/

    getListeMembresEvenement(evenementId:any, seanceId:any) : Observable<any> {
      let queryParams = new HttpParams();
      queryParams = queryParams.appendAll({evenementId : evenementId, seanceId : seanceId });

      return this.http.get(
       environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'membres/getListeMembre' , {params : queryParams}

      );
    }


    //**********************************************************************************************************************/
    //********************************* Services validation membres ********************************************************/

    enregistrerReponseValidationDateMembre(idSelectedEvent: any, reponseMembreDate: string, propositionMembreDate: any, motifPropositionMembre: string) {

      return this.http.post(
        environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'validationMembre/date',
        {idEvenement : idSelectedEvent, reponseMembreDate : reponseMembreDate , propositionMembreDate : propositionMembreDate, motifPropositionMembre: motifPropositionMembre },
         httpOptions
       );

    }

    enregistrerReponseValidationOdjMembre(idSelectedEvent: any) {

      return this.http.post(
        environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'validationMembre/odj',
        {idEvenement : idSelectedEvent },
         httpOptions
       );

    }


    /************************************************************************************************************************/
    //******************************** Services évènement ordre du jour ******************************************************/


    getModelsODJbyOrganeId(idOrgane:any) : Observable<any> {
      return this.http.get(
        environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'Odj/getModelsOdjByOrganeId/'+idOrgane,
         httpOptions
       );
    }

    createOrdreJourFromModel(idEvenement:any, listPointsMODJ:any[]) : Observable<any>{
      return this.http.post(
        environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'Odj/createOrdreJourFromModel/'+idEvenement, listPointsMODJ,
         httpOptions
       );

    }

    updateParametresODJ(idEvenement: any, validationDD: any, delaisValidationDD: any) {
      return this.http.post(
        environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'Odj/updateParametresODJ',
        {idEvenement : idEvenement, validationDD : validationDD , delaisValidationDD : delaisValidationDD },
         httpOptions
       );
    }


    GetListPointTraiteByDossier(idDossier:any) : Observable<any> {
      return this.http.get<any>(
        environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'GetListPointTraiteByDossier/'+idDossier,
       httpOptions
      );
    }


  getAllByTypeOrganeAndSociete(typeOrganeId: number, SocieteId: number, dateFrom: string): Observable<any> {
    let httpparam = new HttpParams()
      .set("typeOrganeId", typeOrganeId)
      .set("societeId", SocieteId)
      .set("dateFrom", dateFrom);
    return this.http.get<any>(
      environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX + 'findByTypeOrganeAndSociete', { params: httpparam });
  }

  getAllByOrganeAndSociete(organeId: number, SocieteId: number, dateFrom: string): Observable<any> {
    let httpparam = new HttpParams()
      .set("organeId", organeId)
      .set("societeId", SocieteId)
      .set("dateFrom", dateFrom);
    return this.http.get<any>(
      environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX + 'findByOrganeAndSociete', { params: httpparam });
  }


  findByOrganeAndPresence(organeId: number): Observable<any> {
    let httpparam = new HttpParams()
      .set("organeId", organeId)
    return this.http.get<any>(
      environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX + 'findByOrganeAndPresence', { params: httpparam });
  }

}
