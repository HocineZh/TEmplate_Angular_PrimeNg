import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Privileges, Profil, ProfilDetails } from '../model/permission-membre';
import { environment } from 'src/environments/environment';
import { ApiConstant } from 'src/app/shared/constant';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models/shared';

@Injectable({
  providedIn: 'root'
})
export class PermissionMembreService {

  constructor(private httpClient : HttpClient) { }


  /**********************Permissions Method ***************************************************************** */
  getAllPrivilege() : Observable <Privileges[]> {
    return this.httpClient.get<Privileges[]>(environment.BASE_URL + ApiConstant.PERMISSION_MEMBRE_PREFIX + 'getAllPrivilege')
  }

  addPrivilege (codePriv : string, description ?: string , type ?: string) : Observable<ApiResponse>{
    return this.httpClient.post<ApiResponse>(environment.BASE_URL + ApiConstant.PERMISSION_MEMBRE_PREFIX + "addPrivilege",{codePriv,description,type});
  }

  editPrivilege (id : number , codePriv : string, description ?: string , type ?: string) : Observable<ApiResponse>{
    return this.httpClient.put<ApiResponse>(environment.BASE_URL + ApiConstant.PERMISSION_MEMBRE_PREFIX + "editPrivilege",{id ,codePriv,description,type});
  }

  deletePrivilege (codePrivilege : string[] ) : Observable<ApiResponse>{
    let httpparam = new HttpParams()
    .set("codePrivilege",codePrivilege.join(','));
    return this.httpClient.delete<ApiResponse>(environment.BASE_URL + ApiConstant.PERMISSION_MEMBRE_PREFIX + "deletePrivilege",{params:httpparam});
  }

  getAllPermissionByProfil(id : string) : Observable<string[]>{
    let httpparam = new HttpParams()
    .set("id",id);
    return this.httpClient.get<string[]>(environment.BASE_URL + ApiConstant.PERMISSION_MEMBRE_PREFIX + 'getAllPrivilegeProfil',{params : httpparam});
  }

  /******************************Profil Methos ******************************************************************** */
  getAllProfil() : Observable <Profil[]> {
    return this.httpClient.get<Profil[]>(environment.BASE_URL + ApiConstant.PERMISSION_MEMBRE_PREFIX + 'getAllProfil')
  }

  getProfil(id : number) : Observable <ProfilDetails> {
    let httpparam = new HttpParams()
    .set("id",id);
    return this.httpClient.get<ProfilDetails>(environment.BASE_URL + ApiConstant.PERMISSION_MEMBRE_PREFIX + 'getProfil',{params : httpparam});
  }


  addProfil (nom : string, description ?: string, duplicated ?: boolean , privileges ?: Privileges[] ) : Observable<ApiResponse>{
    return this.httpClient.post<ApiResponse>(environment.BASE_URL + ApiConstant.PERMISSION_MEMBRE_PREFIX + "addProfil",{nom,description,duplicated,privileges});
  }

  editProfil (id : number , nom : string, description ?: string, duplicated ?: boolean , privileges ?: Privileges[]) : Observable<ApiResponse>{
    return this.httpClient.put<ApiResponse>(environment.BASE_URL + ApiConstant.PERMISSION_MEMBRE_PREFIX + "editProfil",{id ,nom,description,duplicated,privileges});

  }

  deleteProfil (codePrivilege : string[] ) : Observable<ApiResponse>{
    let httpparam = new HttpParams()
    .set("codeRole",codePrivilege.join(','));
    return this.httpClient.delete<ApiResponse>(environment.BASE_URL + ApiConstant.PERMISSION_MEMBRE_PREFIX + "deleteProfil",{params:httpparam});
  }
}
