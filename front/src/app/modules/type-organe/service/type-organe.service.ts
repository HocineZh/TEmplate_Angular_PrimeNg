import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TypeOrgane} from 'src/app/modules/type-organe/model/type-organe';
import { ModelOJ } from "../../model-ordre-jour/models/model-ordre-jour";
import { ModelDelai } from "../../model-delai/model/model-delai";
import { ModelProcess } from "../../model-process/models/model-process";
import { ApiResponse } from 'src/app/shared/models/shared';
import { environment } from 'src/environments/environment';
import { ApiConstant } from 'src/app/shared/constant';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class TypeOrganeService {

  constructor(private http: HttpClient) {}

   //Ajouter un type organe
  createTypeOrgane(designation?: string,abreviation?: string,description?: string,quorum?: number,modelDelais?: ModelDelai,modelOrdreJour?: ModelOJ,modeleProcess?: ModelProcess) : Observable<ApiResponse>
  {
     return this.http.post<ApiResponse>( environment.BASE_URL + ApiConstant.TYPE_ORGANE_PREFIX  +'create',{designation,abreviation,description,quorum,modelDelais,modelOrdreJour,modeleProcess});
  }

   //lister les types d'organe
   getAllOrgane() : Observable<TypeOrgane[]>
   {
     return this.http.get<TypeOrgane[]>(environment.BASE_URL + ApiConstant.TYPE_ORGANE_PREFIX + "getAllTypeOrgane");
   }

   //retourner un organe

  getOrgane (id : number ) : Observable<TypeOrgane>{
    let params = new HttpParams().set("id",id);
    return this.http.get<TypeOrgane>(environment.BASE_URL + ApiConstant.TYPE_ORGANE_PREFIX + 'getTypeOrgane' ,{params : params})
  }

    //Modifier un organe
    editOrgane (id?: number,designation?: string,abreviation?: string,description?: string,quorum?: number,modelDelais?: ModelDelai,modelOrdreJour?: ModelOJ,modeleProcess?: ModelProcess) : Observable<ApiResponse>{
      return this.http.put<ApiResponse>(environment.BASE_URL + ApiConstant.TYPE_ORGANE_PREFIX + "editTypeOrgane",{id,designation,abreviation,description,quorum,modelDelais,modelOrdreJour,modeleProcess});
    }

   //Supprimer un organe
   deleteOrgane(id:number) : Observable<any>
   {
    let params = new HttpParams().set("id",id);
    return this.http.delete(environment.BASE_URL + ApiConstant.TYPE_ORGANE_PREFIX + "deleteTypeOrgane",{params : params});
   }

   //Supprimer des organes
   deleteMultipleOrgane(ids:any) : Observable<any>
   {
    let params = new HttpParams().set("ids",ids);
    return this.http.delete(environment.BASE_URL + ApiConstant.TYPE_ORGANE_PREFIX + "deleteMultipleTypeOrgane",{params : params});
   }
}
