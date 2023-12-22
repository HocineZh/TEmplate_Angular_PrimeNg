import { environment } from './../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConstant } from 'src/app/shared/constant';
import { User, UserDetails } from '../model/user';
import { ApiResponse } from 'src/app/shared/models/shared';
import { Role } from '../../permissions/model/permission';
import { Structure } from '../../hierarchy/model/hierarchy';

import { UserInfoResponse } from '../../authentication/model/login';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient : HttpClient) { }

  //Lister les utilisateurs
  getAlluser() : Observable <User[]> {
    return this.httpClient.get<User[]>(environment.BASE_URL + ApiConstant.USER_PREFIX + 'getAllUser')
  }

  //Lister les utilisateurs Actifs
  getAlluserActif() : Observable <User[]> {
    return this.httpClient.get<User[]>(environment.BASE_URL + ApiConstant.USER_PREFIX + 'getAllUserActif')
  }



  //Get user
  getUser (userId : number ) : Observable<UserDetails>{
    let httpparam = new HttpParams().set("userId",userId);
    return this.httpClient.get<UserDetails>(environment.BASE_URL + ApiConstant.USER_PREFIX + 'getUser' ,{params : httpparam})
  }

  //Ajouter un utilisateur
  addUser(nom:string,prenom:string,email:string,login:string,phone:string,fax:string,pays:string,fonction:string,adresse:string,roles:Role[],structure:Structure, dateNaiss : Date ,  etatCivil : string ) : Observable <ApiResponse> {
    return this.httpClient.post<ApiResponse>(environment.BASE_URL + ApiConstant.USER_PREFIX + 'addUser',{nom,prenom,email,login,phone,fax,pays,fonction,adresse,roles,structure,dateNaiss, etatCivil})
  }

  //Modifier un utilisateur
  editUser(id : number ,nom:string,prenom:string,email:string,login:string,phone:string,fax:string,pays:string,fonction:string,adresse:string,roles:Role[],structure:Structure, dateNaiss : Date , etatCivil : string ) : Observable <ApiResponse> {
    return this.httpClient.put<ApiResponse>(environment.BASE_URL + ApiConstant.USER_PREFIX + 'editUser',{id,nom,prenom,email,login,phone,fax,pays,fonction,adresse,roles,structure,dateNaiss,etatCivil})
  }

  //Activer-Desactiver un utilisateur
  editStatutUser(id : number ,statut:number ) : Observable <ApiResponse> {
    return this.httpClient.put<ApiResponse>(environment.BASE_URL + ApiConstant.USER_PREFIX + 'editStatutUser',{id,statut})
  }

  //Renvoyer le token
  public refreshTokenuser (login : string) : Observable <ApiResponse>{
    return this.httpClient.put<ApiResponse>(environment.BASE_URL + ApiConstant.USER_PREFIX + "refreshTokenuser" , {login})
  }

  //Get Current User
  public getCurrentUser(): Observable<UserInfoResponse> {
    return this.httpClient.get<UserInfoResponse>(environment.BASE_URL + ApiConstant.USER_PREFIX + 'getCurrentUser' )
  }

  public getActiveUser(keyWord: string = "null"){
    return this.httpClient.get<User[]>(environment.BASE_URL + ApiConstant.USER_PREFIX + 'active-users?keyword=' + keyWord )
  }


  getAllUserByStructure(structureId: number) : Observable <User[]> {
    let httpparam = new HttpParams().set("structureId",structureId);
    return this.httpClient.get<User[]>(environment.BASE_URL + ApiConstant.USER_PREFIX + 'getAllUserByStructure',{params : httpparam})
  }


  //reinitialiser le mot de passe
  public renitPassword (oldPassword : string , newPassword : string) : Observable<ApiResponse>{
    return this.httpClient.put<ApiResponse>(environment.BASE_URL + ApiConstant.USER_PREFIX + 'renitPassword', {oldPassword,newPassword} )
  }
}
