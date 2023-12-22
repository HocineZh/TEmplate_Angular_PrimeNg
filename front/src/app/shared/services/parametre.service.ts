import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConstant } from 'src/app/shared/constant';
import { Etats } from '../models/etats';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ParametreService {

  constructor(private httpClient : HttpClient) { }

   //lister les types d'organe
   getEtatsSeance() : Observable<Etats>
   {
     return this.httpClient.get(environment.BASE_URL + ApiConstant.PARAMETRE_PREFIX + "getEtatsSeance");
   }

   getEtatsByType(type:string) : Observable<Etats>
   {
    let httpparam = new HttpParams()
    .set("type",type)
     return this.httpClient.get(environment.BASE_URL + ApiConstant.PARAMETRE_PREFIX + `getEtatsByType`,{params: httpparam});
   }

   //get date aujourd'hui
   getToday() : Observable<any>
   {
     return this.httpClient.get(environment.BASE_URL + ApiConstant.PARAMETRE_PREFIX + "todayDate");
   }

}
