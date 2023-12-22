import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConstant } from 'src/app/shared/constant';
import { evenementPrevisionel } from '../models/evenement_previsionel';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
  })

export class EvenementPrevisionnelService {

    constructor(private http: HttpClient) { }



    getEvenementsPrevisionnels(evenementPrvFilters:any) : Observable<any> {
        let queryParams = new HttpParams();
        queryParams = queryParams.appendAll(evenementPrvFilters);

        return this.http.get<any>(
         environment.BASE_URL + ApiConstant.EVENEMENTS_PRV_PREFIX +'get',
         {params:queryParams}
        );
      }

      getEvenementPrevisionnelById(idEvenementPrv:any) : Observable<any> {

        return this.http.get<any>(
         environment.BASE_URL + ApiConstant.EVENEMENTS_PRV_PREFIX +'getPrvById/'+idEvenementPrv,
             httpOptions

        );
      }

    saveEvenementPrevisionnel(newEvenementPrv:any) : Observable<any> {

      //newEvenementPrv =JSON.stringify(newEvenementPrv);
        return this.http.post(
         environment.BASE_URL + ApiConstant.EVENEMENTS_PRV_PREFIX +'save',newEvenementPrv,
          httpOptions
        );
      }

      updateEvenementPrevisionnel(evenementPrv:any) : Observable<any> {

        //newEvenementPrv =JSON.stringify(newEvenementPrv);
          return this.http.post(
           environment.BASE_URL + ApiConstant.EVENEMENTS_PRV_PREFIX +'update',evenementPrv,
            httpOptions
          );
        }
        updateDateEvenementPrevisionnel(idEvenementPrv:any, evenementDatesPrv:any) : Observable<any> {

          let queryParams = new HttpParams();
          queryParams = queryParams.appendAll(evenementDatesPrv);

          //newEvenementPrv =JSON.stringify(newEvenementPrv);
            return this.http.get(
             environment.BASE_URL + ApiConstant.EVENEMENTS_PRV_PREFIX +'updateDates/'+ idEvenementPrv,
             {params:queryParams}
            );
          }

      deleteEvenementPrevisionnel(idEvenementPrv:any) : Observable<any> {
        return this.http.get(
         environment.BASE_URL + ApiConstant.EVENEMENTS_PRV_PREFIX +'delete/'+idEvenementPrv,
          httpOptions
        );
      }

      exploiterEvenementPrevisionnel(idEvenementPrv:any, evenementDatesPrv:any) : Observable<any> {
        let queryParams = new HttpParams();
        queryParams = queryParams.appendAll(evenementDatesPrv);

        return this.http.get(
         environment.BASE_URL + ApiConstant.EVENEMENTS_PRV_PREFIX +'exploiter/'+idEvenementPrv,
         {params:queryParams}
        );
      }
}
