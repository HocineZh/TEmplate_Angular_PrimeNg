import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Societe, Structure } from '../model/hierarchy';
import { ApiConstant } from 'src/app/shared/constant';
import { ApiResponse } from 'src/app/shared/models/shared';
import { environment } from 'src/environments/environment';
import { User } from '../../users/model/user';

@Injectable({
  providedIn: 'root'
})
export class HierarchyService {

  constructor(private httpClient : HttpClient) { }

  getAllSociete() : Observable <Societe[]> {
    return this.httpClient.get<Societe[]>(environment.BASE_URL + ApiConstant.HIERARCHY_PREFIX + 'getAllSociete')
  }

  getAllStructureBySociete(code : string) : Observable <Structure[]> {
    let httpparam = new HttpParams()
    .set("code",code)
    return this.httpClient.get<Structure[]>(environment.BASE_URL + ApiConstant.HIERARCHY_PREFIX + 'getAllStructureOfSociete',{params : httpparam})
  }

  addSociete(code?:string , raisonSocial ?: string , siege ?: string ): Observable<ApiResponse>{
    return this.httpClient.post<ApiResponse>(environment.BASE_URL + ApiConstant.HIERARCHY_PREFIX + 'createSociete',
    {
      code,
      raisonSocial,
      siege
    }) ;
  }

  editSociete(id : number , code?:string , raisonSocial ?: string , siege ?: string ): Observable<ApiResponse>{
    return this.httpClient.put<ApiResponse>(environment.BASE_URL + ApiConstant.HIERARCHY_PREFIX + 'editSociete',
    {
      id ,
      code,
      raisonSocial,
      siege
    }) ;
  }

  deleteSociete(code : string) : Observable <ApiResponse> {
    let httpparam = new HttpParams()
    .set("code",code)
    return this.httpClient.delete<ApiResponse>(environment.BASE_URL + ApiConstant.HIERARCHY_PREFIX + 'deleteSociete',{params : httpparam})
  }
 /**********************Structure Methods*************************************************************************************************** */

 getAllStructure() : Observable <Structure[]> {
  return this.httpClient.get<Structure[]>(environment.BASE_URL + ApiConstant.HIERARCHY_PREFIX + 'getAllStructure')
}

 addStructure (code?: string , nom ?: string , societe ?: Societe , chargeOrientation ?: User) : Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(environment.BASE_URL + ApiConstant.HIERARCHY_PREFIX + 'createStructure',
    {
      code,
      nom,
      societe,
      chargeOrientation
    }) ;
  }

  editStructure (id: number , code?: string , nom ?: string , societe ?: Societe , chargeOrientation ?: User) : Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>(environment.BASE_URL + ApiConstant.HIERARCHY_PREFIX + 'editStructure',
    {
      id ,
      code,
      nom,
      societe,
      chargeOrientation
    }) ;
  }

  deleteStructure(code : string) : Observable <ApiResponse> {
    let httpparam = new HttpParams()
    .set("code",code)
    return this.httpClient.delete<ApiResponse>(environment.BASE_URL + ApiConstant.HIERARCHY_PREFIX + 'deleteStructure',{params : httpparam})
  }
}
