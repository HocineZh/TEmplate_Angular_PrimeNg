import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConstant } from 'src/app/shared/constant';
import { Organe} from 'src/app/modules/organes/model/organe';
import { ApiResponse } from 'src/app/shared/models/shared';
import { TypeOrgane } from 'src/app/modules/type-organe/model/type-organe';
import { Societe } from 'src/app/modules/hierarchy/model/hierarchy';
import { environment } from 'src/environments/environment';
import { typeAccessOrgane } from '../../evenements/models/evenement';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})

export class OrganeService {

  constructor(private httpClient: HttpClient) {}


  createOrgane(titre:string,description:string,typeOrgane:TypeOrgane,societe:Societe , mandate: boolean) : Observable <Organe> {

    return this.httpClient.post<Organe>(environment.BASE_URL + ApiConstant.ORGANE_PREFIX + 'create',{titre,description,typeOrgane,societe,mandate})
  }

   //lister les organes
   getAllOrgane() : Observable<Organe[]>
   {
     return this.httpClient.get<Organe[]>(environment.BASE_URL + ApiConstant.ORGANE_PREFIX + "getAllOrgane");

   }

   //retourner un organe

    getOrgane (id : number ) : Observable<Organe>{
      let params = new HttpParams().set("id",id);
      return this.httpClient.get<Organe>(environment.BASE_URL + ApiConstant.ORGANE_PREFIX + 'getOrgane' ,{params : params})
    }

    //Modifier un organe
    editOrgane (id?: number,titre?:string,description?:string,typeOrgane?:TypeOrgane,societe?:Societe) : Observable<ApiResponse>{
      return this.httpClient.put<ApiResponse>(environment.BASE_URL + ApiConstant.ORGANE_PREFIX + "editOrgane",{id,titre,description,typeOrgane,societe});
    }

   //Supprimer un organe
   deleteOrgane(id:number) : Observable<any>
   {
    let params = new HttpParams().set("id",id);
    return this.httpClient.delete(environment.BASE_URL + ApiConstant.ORGANE_PREFIX + "deleteOrgane",{params : params});
   }

   //get all organe membres
   getAllOrganesMembre(typeAccess:typeAccessOrgane) : Observable<any[]>
   {
    let params = new HttpParams().set("typeAccess",typeAccess);
     return this.httpClient.get<any[]>(environment.BASE_URL + ApiConstant.ORGANE_PREFIX + "getAllOrganesMembre",
     {params : params});

   }

   //lister les organes
   getAllOrganeByUserSociete() : Observable<any[]>
   {
     return this.httpClient.get<any[]>(environment.BASE_URL + ApiConstant.ORGANE_PREFIX + "getAllOrganeByUserSociete");

   }

}
