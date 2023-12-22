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

export class PointOrdreService {



      constructor(private http: HttpClient){

      }

      //************************************************************************************************************************************ */
      //****************************Gestion des points ordres et validation ********************************************************************************* */
      //*********************************************************************************************************************************** */


      getListPointsOrdreEvenement(evenementId:any) : Observable<any> {

          return this.http.get(
           environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'Odj/pointOrdre/list/' + evenementId ,
            httpOptions
          );
    }

        addPointOrdreToEvenement(evenementId:any, newPointOrdre:any  ) : Observable<any> {

          return this.http.post(
           environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'Odj/pointOrdre/add/' + evenementId, newPointOrdre,
            httpOptions
          );
        }

        retirerPointOrdreFromEvenement(evenementId:any, pointOrdreId:number[]) : Observable<any> {

              return this.http.get(
               environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'Odj/pointOrdre/retirer/' + evenementId + '/' + pointOrdreId ,
                httpOptions
              );
        }

        reorderListPoEvenement(evenementId :any, newOrdreList:any[]): Observable<any> {

            return this.http.post(
             environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'Odj/pointOrdre/reorder/' + evenementId, newOrdreList,
              httpOptions
            );
          }

       updatePoEvenement(evenementId :any, pointOrdre:any): Observable<any> {

              return this.http.post(
               environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'Odj/pointOrdre/update/' + evenementId, pointOrdre,
                httpOptions
              );
            }


      validerPointOrdreEvenement(evenementId:any, pointOrdreId:any  ) : Observable<any> {

              return this.http.get(
               environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'Odj/pointOrdre/valider/' + evenementId + '/' + pointOrdreId ,
                httpOptions
              );
        }




      validerOrdreJourEvenement(evenementId:any) : Observable<any> {

        return this.http.get(
         environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'Odj/validerOdj/' + evenementId ,
          httpOptions
        );
      }


      //************************************************************************************************************************************ */
      //****************************Gestion des documents valides point ordre ********************************************************************************* */
      //*********************************************************************************************************************************** */


      chargerDocumentsValidePOEvenement(evenementId: any, pointOrdreId: any, uploadedFilesPo: any[]) {

          const formData: FormData = new FormData();
           formData.append('evenementId', evenementId.toString());
           formData.append('pointOrdreId' , pointOrdreId.toString());
           //formData.append("uploadedFilesPo" ,uploadedFilesPo );
           uploadedFilesPo.forEach((file,index) => {
            formData.append('file[]', file!);
          });

          /* let queryParams = new HttpParams();
          let params = {evenementId : evenementId , pointOrdreId : pointOrdreId, documentsPo : uploadedFilesPo  }
          queryParams = queryParams.appendAll(params); */

          return this.http.post(
            environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'Odj/pointOrdre/chargerDocumentsValide',formData
           );
        }

     getDocumentsValidePoEvenement(pointOrdreId:any) : Observable<any> {

          let queryParams = new HttpParams();
          queryParams = queryParams.appendAll({pointOrdreId : pointOrdreId });

          return this.http.get(
           environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'Odj/pointOrdre/listDocumentsValide' , {params : queryParams}

          );
     }

     supprimerSelectedDocPoEvenement(pointOrdreId: any, idDocument: any) {
      let queryParams = new HttpParams();
      queryParams = queryParams.appendAll({pointOrdreId : pointOrdreId, idDocument : idDocument });

      return this.http.get(
       environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'Odj/pointOrdre/supprimerDocumentValide' , {params : queryParams}

      );
    }
    downloadSelectedDocPoEvenement(pointOrdreId: any, idDocument: any) {
      let queryParams = new HttpParams();
      queryParams = queryParams.appendAll({pointOrdreId : pointOrdreId, idDocument : idDocument  });

      return this.http.get(
       environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'Odj/pointOrdre/downloadDocumentValide' , {params : queryParams}

      );
    }


      //************************************************************************************************************************************ */
      //****************************Gestion des points ordres ajournés ********************************************************************************* */
      //*********************************************************************************************************************************** */


    getListPoAjournesPreviousEvenements(evenementId:any) : Observable<any> {

      return this.http.get(
       environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'Odj/pointsAjournes/list/' + evenementId ,
        httpOptions
      );
   }

      retirerPointsAjournes(pointsAjournes:any[]){
        return this.http.post(
          environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'Odj/pointsAjournes/retirer', pointsAjournes,
           httpOptions
         );
       }

       importerPointAjournerToEvenement(idEvenment:any, idPointAjn:any){
        return this.http.post(
          environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'Odj/pointsAjournes/importer/'+idEvenment, idPointAjn,
           httpOptions
         );
       }

      //************************************************************************************************************************************ */
      //****************************Gestion des commentaires point ordre ********************************************************************************* */
      //*********************************************************************************************************************************** */

       addCommentaireToPointOrdre(evenementId:any, pointOrdreId:any, commentaire : any  ) : Observable<any> {

        return this.http.post(
         environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'Odj/pointOrdre/addCommentaire' , {evenementId : evenementId , pointOrdreId : pointOrdreId, commentaire : commentaire },
          httpOptions
        );
      }

      //************************************************************************************************************************************ */
      //****************************Gestion intervenants ********************************************************************************* */
      //*********************************************************************************************************************************** */


      getIntervenantAndDocsPoEvenement(evenementId:any, pointOrdreId:any) : Observable<any> {
        let queryParams = new HttpParams();
        queryParams = queryParams.appendAll({evenementId : evenementId, pointOrdreId : pointOrdreId });

        return this.http.get(
         environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'Odj/pointOrdre/getSelectedIntervenant' , {params : queryParams}

        );
      }

      affecterIntervenantToPointOrdre(evenementId:any, pointOrdreId:any, intervenantId : any  ) : Observable<any> {

        return this.http.post(
         environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'Odj/pointOrdre/afftecter_intervenant' , {evenementId : evenementId , pointOrdreId : pointOrdreId, intervenantId : intervenantId },
          httpOptions
        );
      }

      getListUsersIntervenants(keyword:any) : Observable<any> {

        let queryParams = new HttpParams();
        queryParams = queryParams.appendAll({keyword : keyword  });

        return this.http.get(
         environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'Odj/pointOrdre/getListUsersIntervenants', {params : queryParams}

        );
     }

     chargerDocumentsIntervenantPOEvenement(evenementId: any, pointOrdreId: any, uploadedFilesPo: any[]) {

      const formData: FormData = new FormData();
       formData.append('evenementId', evenementId.toString());
       formData.append('pointOrdreId' , pointOrdreId.toString());
       //formData.append("uploadedFilesPo" ,uploadedFilesPo );
       uploadedFilesPo.forEach((file,index) => {
        formData.append('file[]', file!);
      });

      /* let queryParams = new HttpParams();
      let params = {evenementId : evenementId , pointOrdreId : pointOrdreId, documentsPo : uploadedFilesPo  }
      queryParams = queryParams.appendAll(params); */

      return this.http.post(
        environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'Odj/pointOrdre/chargerDocumentsIntervenant',formData

       );
    }

    getPointsOrdresDocsOfIntervenantEvenement(evenementId:any) : Observable<any> {
      let queryParams = new HttpParams();
      queryParams = queryParams.appendAll({evenementId : evenementId });

      return this.http.get(
       environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'Odj/pointOrdre/getPosDocsIntervenant' , {params : queryParams}

      );
    }

    //**************************************************************************************************/
    //************************** Gestion des traitement points seances *********************************/
    //**************************************************************************************************/

    getListPoSeance(idSeance: any) {
      let queryParams = new HttpParams();
      queryParams = queryParams.appendAll({idSeance : idSeance });

      return this.http.get(
       environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'Odj/traitement/getListPoSeance' , {params : queryParams}

      );
    }

    changerEtatPoSeance(idSeance: any, tpoId: any, etat: string) {

      return this.http.post(
        environment.BASE_URL + ApiConstant.EVENEMENTS_PREFIX +'Odj/traitement/changerEtatPoSeance', {idSeance : idSeance, tpoId : tpoId, etat : etat},
         httpOptions
       );
    }



   }


