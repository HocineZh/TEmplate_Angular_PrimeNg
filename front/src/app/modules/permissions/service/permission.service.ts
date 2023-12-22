import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Privilege, Role, RoleDetails } from '../model/permission';
import { ApiConstant } from 'src/app/shared/constant';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models/shared';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(private httpClient : HttpClient) { }

  /**********************Permissions Method ***************************************************************** */
  getAllPrivilege() : Observable <Privilege[]> {
    return this.httpClient.get<Privilege[]>(environment.BASE_URL + ApiConstant.PERMISSION_PREFIX + 'getAllPrivilege')
  }

  addPrivilege (codePrivilege : string, description ?: string , type ?: string) : Observable<ApiResponse>{
    return this.httpClient.post<ApiResponse>(environment.BASE_URL + ApiConstant.PERMISSION_PREFIX + "addPrivilege",{codePrivilege,description,type});
  }

  editPrivilege (id : number , codePrivilege : string, description ?: string , type ?: string) : Observable<ApiResponse>{
    return this.httpClient.put<ApiResponse>(environment.BASE_URL + ApiConstant.PERMISSION_PREFIX + "editPrivilege",{id ,codePrivilege,description,type});
  }

  deletePrivilege (codePrivilege : string[] ) : Observable<ApiResponse>{
    let httpparam = new HttpParams()
    .set("codePrivilege",codePrivilege.join(','));
    return this.httpClient.delete<ApiResponse>(environment.BASE_URL + ApiConstant.PERMISSION_PREFIX + "deletePrivilege",{params:httpparam});
  }

  getAllPermissionByLogin(login : string) : Observable<string[]>{
    let httpparam = new HttpParams()
    .set("login",login);
    return this.httpClient.get<string[]>(environment.BASE_URL + ApiConstant.PERMISSION_PREFIX + 'getAllPriv',{params : httpparam});
  }

  /******************************Roles Methos ******************************************************************** */
  getAllRole() : Observable <Role[]> {
    return this.httpClient.get<Role[]>(environment.BASE_URL + ApiConstant.PERMISSION_PREFIX + 'getAllRole')
  }

  getRole(id : number) : Observable <RoleDetails> {
    let httpparam = new HttpParams()
    .set("id",id);
    return this.httpClient.get<RoleDetails>(environment.BASE_URL + ApiConstant.PERMISSION_PREFIX + 'getRole',{params : httpparam});
  }


  addRole (nom : string, description ?: string , privileges ?: Privilege[] ) : Observable<ApiResponse>{
    return this.httpClient.post<ApiResponse>(environment.BASE_URL + ApiConstant.PERMISSION_PREFIX + "addRole",{nom,description,privileges});
  }

  editRole (id : number , nom : string, description ?: string , privileges ?: Privilege[]) : Observable<ApiResponse>{
    return this.httpClient.put<ApiResponse>(environment.BASE_URL + ApiConstant.PERMISSION_PREFIX + "editRole",{id ,nom,description,privileges});

  }

  deleteRole (codePrivilege : string[] ) : Observable<ApiResponse>{
    let httpparam = new HttpParams()
    .set("codeRole",codePrivilege.join(','));
    return this.httpClient.delete<ApiResponse>(environment.BASE_URL + ApiConstant.PERMISSION_PREFIX + "deleteRole",{params:httpparam});
  }

}
